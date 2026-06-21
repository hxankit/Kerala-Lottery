const express = require('express')
const cors = require('cors')
const fs = require('fs/promises')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 4000
const ADMIN_PASSWORD = 'DevxExpanzia'
const WINNERS_PATH = path.join(__dirname, 'winners.json')
const CLIENT_BUILD_PATH = path.join(__dirname, '../Client/dist')

app.use(cors())
app.use(express.json())
app.use(express.static(CLIENT_BUILD_PATH))

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

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {}
  if (typeof password !== 'string') {
    return res.status(400).json({ ok: false, message: 'Password is required' })
  }

  if (password === ADMIN_PASSWORD) {
    return res.json({ ok: true })
  }

  return res.status(401).json({ ok: false, message: 'Invalid password' })
})

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
    const match = winners.find((winner) => String(winner.phone || '').replace(/[^0-9]/g, '') === normalized)
    if (!match) {
      return res.status(404).json({ ok: false, message: 'Winner not found' })
    }

    res.json({ ok: true, winner: match })
  } catch (error) {
    console.error(error)
    res.status(500).json({ ok: false, message: 'Unable to lookup winner' })
  }
})

app.post('/api/winners', async (req, res) => {
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

app.delete('/api/winners/:index', async (req, res) => {
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
