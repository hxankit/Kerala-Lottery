require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const crypto = require('crypto')

const {
  readWinners,
  addWinner,
  updateWinner,
  deleteWinner,
  readUsers,
  addUser,
  updateUserPassword,
  deleteUser,
} = require('./googleSheets')

const app = express()
const PORT = process.env.PORT || 4000
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL

if (!ADMIN_PASSWORD || !SUPERADMIN_EMAIL) {
  throw new Error('ADMIN_PASSWORD or SUPERADMIN_EMAIL is not set. Check your .env file.')
}
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CLIENT_BUILD_PATH = path.join(__dirname, '../Client/dist')

app.use(cors())
app.use(express.json())
app.use(express.static(CLIENT_BUILD_PATH))

function publicUser({ email, createdAt, createdBy }) {
  return { email, createdAt, createdBy }
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
const sessions = new Map() // token -> { email, role, expires }
const SESSION_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

function issueSession(email, role) {
  const token = crypto.randomBytes(32).toString('hex')
  sessions.set(token, { email, role, expires: Date.now() + SESSION_TTL_MS })
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
  const { email, password } = req.body || {}
  if (typeof password !== 'string' || !password) {
    return res.status(400).json({ ok: false, message: 'Password is required' })
  }
  const mail = typeof email === 'string' && email.trim() ? email.trim().toLowerCase() : SUPERADMIN_EMAIL

  if (mail === SUPERADMIN_EMAIL) {
    if (password === ADMIN_PASSWORD) {
      const token = issueSession(SUPERADMIN_EMAIL, 'superadmin')
      return res.json({ ok: true, token, email: SUPERADMIN_EMAIL, role: 'superadmin' })
    }
    return res.status(401).json({ ok: false, message: 'Invalid password' })
  }

  try {
    const users = await readUsers()
    const user = users.find((u) => u.email.toLowerCase() === mail)
    if (!user || !verifyPassword(password, user.salt, user.hash)) {
      return res.status(401).json({ ok: false, message: 'Invalid email or password' })
    }
    const token = issueSession(user.email, 'subadmin')
    return res.json({ ok: true, token, email: user.email, role: 'subadmin' })
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
  res.json({ ok: true, email: req.session.email, role: req.session.role })
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
  const { email, password } = req.body || {}
  const mail = typeof email === 'string' ? email.trim().toLowerCase() : ''
  if (!mail || !EMAIL_REGEX.test(mail) || !password || String(password).length < 6) {
    return res.status(400).json({ ok: false, message: 'A valid email and a password of at least 6 characters are required' })
  }
  if (mail === SUPERADMIN_EMAIL) {
    return res.status(400).json({ ok: false, message: 'That email is reserved' })
  }
  try {
    const existingUsers = await readUsers()
    if (existingUsers.some((u) => u.email.toLowerCase() === mail)) {
      return res.status(409).json({ ok: false, message: 'A subadmin with that email already exists' })
    }
    const { salt, hash } = createPasswordRecord(password)
    const users = await addUser({
      email: mail,
      salt,
      hash,
      createdAt: new Date().toISOString(),
      createdBy: req.session.email,
    })
    res.status(201).json({ ok: true, users: users.map(publicUser) })
  } catch (error) {
    console.error(error)
    res.status(500).json({ ok: false, message: 'Unable to create subadmin' })
  }
})

app.put('/api/admin/users/:email', requireAuth(['superadmin']), async (req, res) => {
  const targetEmail = decodeURIComponent(req.params.email).toLowerCase()
  const { password } = req.body || {}
  if (!password || String(password).length < 6) {
    return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters' })
  }
  try {
    const { salt, hash } = createPasswordRecord(password)
    const result = await updateUserPassword(targetEmail, salt, hash)
    if (!result) return res.status(404).json({ ok: false, message: 'Subadmin not found' })
    res.json({ ok: true, message: 'Password updated' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ ok: false, message: 'Unable to update subadmin' })
  }
})

app.delete('/api/admin/users/:email', requireAuth(['superadmin']), async (req, res) => {
  const targetEmail = decodeURIComponent(req.params.email).toLowerCase()
  try {
    const result = await deleteUser(targetEmail)
    if (!result) {
      return res.status(404).json({ ok: false, message: 'Subadmin not found' })
    }

    // Invalidate any active sessions for the deleted subadmin
    for (const [token, session] of sessions.entries()) {
      if (session.role === 'subadmin' && session.email.toLowerCase() === targetEmail) {
        sessions.delete(token)
      }
    }

    res.json({ ok: true, users: result.map(publicUser) })
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
    const winners = await addWinner({
      name,
      phone,
      ticketNumber,
      position: position || '5Th',
      date: new Date().toISOString(),
    })
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
    const existingWinners = await readWinners()
    if (index < 0 || index >= existingWinners.length) {
      return res.status(404).json({ ok: false, message: 'Winner not found' })
    }

    const existing = existingWinners[index]
    const updatedWinner = {
      ...existing,
      name: typeof name === 'string' && name.trim() ? name.trim() : existing.name,
      phone: typeof phone === 'string' && phone.trim() ? phone.trim() : existing.phone,
      ticketNumber: typeof ticketNumber === 'string' && ticketNumber.trim() ? ticketNumber.trim() : existing.ticketNumber,
      position: typeof position === 'string' && position.trim() ? position.trim() : existing.position,
      date: new Date().toISOString(),
    }

    const winners = await updateWinner(index, updatedWinner)
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
    const existingWinners = await readWinners()
    if (index < 0 || index >= existingWinners.length) {
      return res.status(404).json({ ok: false, message: 'Winner not found' })
    }
    const winners = await deleteWinner(index)
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