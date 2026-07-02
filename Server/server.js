const express = require('express')
const cors = require('cors')
const fs = require('fs/promises')
const path = require('path')
const crypto = require('crypto')

const app = express()
const PORT = process.env.PORT || 4000
const ADMIN_PASSWORD = 'DevxExpanzia'
const SUPERADMIN_USERNAME = 'superadmin'
const WINNERS_PATH = path.join(__dirname, 'winners.json')
const USERS_PATH = path.join(__dirname, 'users.json')
const CLIENT_BUILD_PATH = path.join(__dirname, '../Client/dist')

app.use(cors())
app.use(express.json())
app.use(express.static(CLIENT_BUILD_PATH))

// ---------- winners persistence ----------
async function readWinners() {
  try {
    const data = await fs.readFile(WINNERS_PATH, 'utf8')
    return JSON.parse(data || '[]')
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

async function writeWinners(winners) {
  await fs.writeFile(WINNERS_PATH, JSON.stringify(winners, null, 2), 'utf8')
}

// ---------- subadmin user persistence ----------
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_PATH, 'utf8')
    return JSON.parse(data || '[]')
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

async function writeUsers(users) {
  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2), 'utf8')
}

function publicUser({ username, createdAt, createdBy }) {
  return { username, createdAt, createdBy }
}

// ---------- password hashing ----------
function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex')
}

function createPasswordRecord(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  return { salt, hash: hashPassword(password, salt) }
}

function verifyPassword(password, salt, hash) {
  const candidate = Buffer.from(hashPassword(password, salt), 'hex')
  const expected = Buffer.from(hash, 'hex')
  return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected)
}

// ---------- sessions (in-memory tokens) ----------
const sessions = new Map() // token -> { username, role, expires }
const SESSION_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

function issueSession(username, role) {
  const token = crypto.randomBytes(32).toString('hex')
  sessions.set(token, { username, role, expires: Date.now() + SESSION_TTL_MS })
  return token
}

function getSession(token) {
  const session = sessions.get(token)
  if (!session) return null
  if (session.expires < Date.now()) {
    sessions.delete(token)
    return null
  }
  return session
}

function getToken(req) {
  const header = req.headers.authorization || ''
  return header.startsWith('Bearer ') ? header.slice(7) : null
}

function requireAuth(roles = ['superadmin', 'subadmin']) {
  return (req, res, next) => {
    const session = getSession(getToken(req))
    if (!session || !roles.includes(session.role)) {
      return res.status(401).json({ ok: false, message: 'Unauthorized' })
    }
    req.session = session
    next()
  }
}

// ---------- auth routes ----------
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body || {}
  if (typeof password !== 'string' || !password) {
    return res.status(400).json({ ok: false, message: 'Password is required' })
  }
  const uname = typeof username === 'string' && username.trim() ? username.trim() : SUPERADMIN_USERNAME

  if (uname.toLowerCase() === SUPERADMIN_USERNAME) {
    if (password === ADMIN_PASSWORD) {
      const token = issueSession(SUPERADMIN_USERNAME, 'superadmin')
      return res.json({ ok: true, token, username: SUPERADMIN_USERNAME, role: 'superadmin' })
    }
    return res.status(401).json({ ok: false, message: 'Invalid password' })
  }

  try {
    const users = await readUsers()
    const user = users.find((u) => u.username.toLowerCase() === uname.toLowerCase())
    if (!user || !verifyPassword(password, user.salt, user.hash)) {
      return res.status(401).json({ ok: false, message: 'Invalid username or password' })
    }
    const token = issueSession(user.username, 'subadmin')
    return res.json({ ok: true, token, username: user.username, role: 'subadmin' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ ok: false, message: 'Login failed' })
  }
})

app.post('/api/admin/logout', requireAuth(), (req, res) => {
  const token = getToken(req)
  if (token) sessions.delete(token)
  res.json({ ok: true })
})

app.get('/api/admin/me', requireAuth(), (req, res) => {
  res.json({ ok: true, username: req.session.username, role: req.session.role })
})

// ---------- subadmin management (superadmin only) ----------
app.get('/api/admin/users', requireAuth(['superadmin']), async (req, res) => {
  try {
    const users = await readUsers()
    res.json({ ok: true, users: users.map(publicUser) })
  } catch (error) {
    console.error(error)
    res.status(500).json({ ok: false, message: 'Unable to read subadmins' })
  }
})

app.post('/api/admin/users', requireAuth(['superadmin']), async (req, res) => {
  const { username, password } = req.body || {}
  const uname = typeof username === 'string' ? username.trim() : ''
  if (!uname || !password || String(password).length < 6) {
    return res.status(400).json({ ok: false, message: 'Username and a password of at least 6 characters are required' })
  }
  if (uname.toLowerCase() === SUPERADMIN_USERNAME) {
    return res.status(400).json({ ok: false, message: 'That username is reserved' })
  }
  try {
    const users = await readUsers()
    if (users.some((u) => u.username.toLowerCase() === uname.toLowerCase())) {
      return res.status(409).json({ ok: false, message: 'A subadmin with that username already exists' })
    }
    const { salt, hash } = createPasswordRecord(password)
    users.push({
      username: uname,
      salt,
      hash,
      createdAt: new Date().toISOString(),
      createdBy: req.session.username,
    })
    await writeUsers(users)
    res.status(201).json({ ok: true, users: users.map(publicUser) })
  } catch (error) {
    console.error(error)
    res.status(500).json({ ok: false, message: 'Unable to create subadmin' })
  }
})

app.put('/api/admin/users/:username', requireAuth(['superadmin']), async (req, res) => {
  const { username } = req.params
  const { password } = req.body || {}
  if (!password || String(password).length < 6) {
    return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters' })
  }
  try {
    const users = await readUsers()
    const idx = users.findIndex((u) => u.username === username)
    if (idx === -1) return res.status(404).json({ ok: false, message: 'Subadmin not found' })
    const { salt, hash } = createPasswordRecord(password)
    users[idx] = { ...users[idx], salt, hash }
    await writeUsers(users)
    res.json({ ok: true, message: 'Password updated' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ ok: false, message: 'Unable to update subadmin' })
  }
})

app.delete('/api/admin/users/:username', requireAuth(['superadmin']), async (req, res) => {
  const { username } = req.params
  try {
    const users = await readUsers()
    const next = users.filter((u) => u.username !== username)
    if (next.length === users.length) {
      return res.status(404).json({ ok: false, message: 'Subadmin not found' })
    }
    await writeUsers(next)

    // Invalidate any active sessions for the deleted subadmin
    for (const [token, session] of sessions.entries()) {
      if (session.role === 'subadmin' && session.username === username) {
        sessions.delete(token)
      }
    }

    res.json({ ok: true, users: next.map(publicUser) })
  } catch (error) {
    console.error(error)
    res.status(500).json({ ok: false, message: 'Unable to delete subadmin' })
  }
})

// ---------- winners routes ----------
app.get('/api/winners', async (req, res) => {
  try {
    const winners = await readWinners()
    res.json({ ok: true, winners })
  } catch (error) {
    console.error(error)
    res.status(500).json({ ok: false, message: 'Unable to read winners' })
  }
})

app.get('/api/winners/lookup', async (req, res) => {
  const { phone } = req.query || {}
  if (!phone) {
    return res.status(400).json({ ok: false, message: 'Phone is required' })
  }

  try {
    const normalized = String(phone).replace(/[^0-9]/g, '')
    const winners = await readWinners()
    const matchIndex = winners.findIndex(
      (winner) => String(winner.phone || '').replace(/[^0-9]/g, '') === normalized
    )
    if (matchIndex === -1) {
      return res.status(404).json({ ok: false, message: 'Winner not found' })
    }

    const otherFifthTicketNumbers = winners
      .filter((winner, index) => {
        const position = String(winner.position || '').trim().toLowerCase()
        return position === '5th' && index !== matchIndex
      })
      .map((winner) => winner.ticketNumber || '')
      .slice(0, 9)

    res.json({ ok: true, winner: winners[matchIndex], otherFifthTicketNumbers })
  } catch (error) {
    console.error(error)
    res.status(500).json({ ok: false, message: 'Unable to lookup winner' })
  }
})

app.post('/api/winners', requireAuth(), async (req, res) => {
  const { name, phone, ticketNumber, position } = req.body || {}
  if (!name || !phone || !ticketNumber) {
    return res.status(400).json({ ok: false, message: 'Name, phone and ticket number are required' })
  }

  try {
    const winners = await readWinners()
    const newWinner = {
      name,
      phone,
      ticketNumber,
      position: position || '5Th',
      date: new Date().toISOString(),
    }
    winners.push(newWinner)
    await writeWinners(winners)
    res.status(201).json({ ok: true, winners })
  } catch (error) {
    console.error(error)
    res.status(500).json({ ok: false, message: 'Unable to save winner' })
  }
})

app.put('/api/winners/:index', requireAuth(), async (req, res) => {
  const index = parseInt(req.params.index, 10)
  const { name, phone, ticketNumber, position } = req.body || {}

  if (Number.isNaN(index)) {
    return res.status(400).json({ ok: false, message: 'Invalid index' })
  }

  try {
    const winners = await readWinners()
    if (index < 0 || index >= winners.length) {
      return res.status(404).json({ ok: false, message: 'Winner not found' })
    }

    const existing = winners[index]
    const updatedWinner = {
      ...existing,
      name: typeof name === 'string' && name.trim() ? name.trim() : existing.name,
      phone: typeof phone === 'string' && phone.trim() ? phone.trim() : existing.phone,
      ticketNumber: typeof ticketNumber === 'string' && ticketNumber.trim() ? ticketNumber.trim() : existing.ticketNumber,
      position: typeof position === 'string' && position.trim() ? position.trim() : existing.position,
      date: new Date().toISOString(),
    }

    winners[index] = updatedWinner
    await writeWinners(winners)
    res.json({ ok: true, winners })
  } catch (error) {
    console.error(error)
    res.status(500).json({ ok: false, message: 'Unable to update winner' })
  }
})

app.delete('/api/winners/:index', requireAuth(), async (req, res) => {
  const index = parseInt(req.params.index, 10)
  if (Number.isNaN(index)) {
    return res.status(400).json({ ok: false, message: 'Invalid index' })
  }

  try {
    const winners = await readWinners()
    if (index < 0 || index >= winners.length) {
      return res.status(404).json({ ok: false, message: 'Winner not found' })
    }
    winners.splice(index, 1)
    await writeWinners(winners)
    res.json({ ok: true, winners })
  } catch (error) {
    console.error(error)
    res.status(500).json({ ok: false, message: 'Unable to delete winner' })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ ok: false, message: 'API route not found' })
  }
  res.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})