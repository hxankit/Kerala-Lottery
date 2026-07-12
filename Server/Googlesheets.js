require('dotenv').config()
const { google } = require('googleapis')

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID

const WINNERS_SHEET = 'Winners'
const USERS_SHEET = 'Users'

// Sheet gids (tab IDs) — needed only for row deletion.
const WINNERS_GID = 0
const USERS_GID = 965938022

if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
  throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not set. Check your .env file.')
}
if (!SPREADSHEET_ID) {
  throw new Error('GOOGLE_SPREADSHEET_ID is not set. Check your .env file.')
}

let credentials
try {
  credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
} catch (err) {
  throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON. Check your .env file formatting.')
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

async function getSheetsClient() {
  const client = await auth.getClient()
  return google.sheets({ version: 'v4', auth: client })
}

// ---------- generic helpers ----------
async function readRows(tabName) {
  const sheets = await getSheetsClient()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tabName}!A2:Z`, // skip header row
  })
  return res.data.values || []
}

async function appendRow(tabName, rowValues) {
  const sheets = await getSheetsClient()
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tabName}!A:Z`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [rowValues] },
  })
}

async function updateRow(tabName, rowNumber, rowValues) {
  // rowNumber is 1-based sheet row (data starts at row 2)
  const sheets = await getSheetsClient()
  const lastCol = String.fromCharCode(65 + rowValues.length - 1) // A, B, C...
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tabName}!A${rowNumber}:${lastCol}${rowNumber}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [rowValues] },
  })
}

async function deleteRow(tabName, gid, rowNumber) {
  // rowNumber is 1-based sheet row; deleteDimension uses 0-based index
  const sheets = await getSheetsClient()
  const startIndex = rowNumber - 1
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: { sheetId: gid, dimension: 'ROWS', startIndex, endIndex: startIndex + 1 },
          },
        },
      ],
    },
  })
}

// ---------- Winners ----------
function rowToWinner(row) {
  return {
    name: row[0] || '',
    phone: row[1] || '',
    ticketNumber: row[2] || '',
    position: row[3] || '',
    date: row[4] || '',
  }
}

function winnerToRow(winner) {
  return [winner.name, winner.phone, winner.ticketNumber, winner.position, winner.date]
}

async function readWinners() {
  const rows = await readRows(WINNERS_SHEET)
  return rows.map(rowToWinner)
}

async function addWinner(winner) {
  await appendRow(WINNERS_SHEET, winnerToRow(winner))
  return readWinners()
}

async function updateWinner(index, winner) {
  const rowNumber = index + 2 // +1 header, +1 to convert 0-based to 1-based
  await updateRow(WINNERS_SHEET, rowNumber, winnerToRow(winner))
  return readWinners()
}

async function deleteWinner(index) {
  const rowNumber = index + 2
  await deleteRow(WINNERS_SHEET, WINNERS_GID, rowNumber)
  return readWinners()
}

// ---------- Users (subadmins) ----------
function rowToUser(row) {
  return {
    email: row[0] || '',
    salt: row[1] || '',
    hash: row[2] || '',
    createdAt: row[3] || '',
    createdBy: row[4] || '',
  }
}

function userToRow(user) {
  return [user.email, user.salt, user.hash, user.createdAt, user.createdBy]
}

async function readUsers() {
  const rows = await readRows(USERS_SHEET)
  return rows.map(rowToUser)
}

async function addUser(user) {
  await appendRow(USERS_SHEET, userToRow(user))
  return readUsers()
}

async function updateUserPassword(email, salt, hash) {
  const users = await readUsers()
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())
  if (idx === -1) return null
  const rowNumber = idx + 2
  const updated = { ...users[idx], salt, hash }
  await updateRow(USERS_SHEET, rowNumber, userToRow(updated))
  return readUsers()
}

async function deleteUser(email) {
  const users = await readUsers()
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())
  if (idx === -1) return null
  const rowNumber = idx + 2
  await deleteRow(USERS_SHEET, USERS_GID, rowNumber)
  return readUsers()
}

module.exports = {
  readWinners,
  addWinner,
  updateWinner,
  deleteWinner,
  readUsers,
  addUser,
  updateUserPassword,
  deleteUser,
}