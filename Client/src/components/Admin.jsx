import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { lotteryUtils } from '@/lib/lotteryUtils'
import { TicketGenerator } from './TicketGenerator'

function HeaderBanner({ label, secure = true }) {
  return (
    <div className="flex items-center gap-2.5 bg-gradient-to-r from-[#f5d96b] via-[#ffe98a] to-[#f5d96b] border-b-[3px] border-amber-600 px-4 py-2 rounded-t-xl">
      <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
      <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">{label}</span>
      {secure && (
        <span className="ml-auto bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wider uppercase">
          Secure
        </span>
      )}
    </div>
  )
}

function Alert({ type, children }) {
  const styles =
    type === 'red'
      ? 'bg-red-50 border border-red-300 text-red-700'
      : 'bg-amber-50 border border-amber-300 text-amber-800'
  const dotColor = type === 'red' ? 'bg-red-600' : 'bg-amber-500'

  return (
    <div role="alert" className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold ${styles}`}>
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
      {children}
    </div>
  )
}

// ---------- confirmation dialog ----------
function ConfirmDialog({ title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-sm rounded-2xl border-2 border-amber-400/50 bg-[#fffaf0] shadow-xl overflow-hidden">
        <div className="flex items-center gap-2.5 bg-gradient-to-r from-[#f5d96b] via-[#ffe98a] to-[#f5d96b] border-b-[3px] border-amber-600 px-4 py-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${danger ? 'bg-red-600' : 'bg-amber-500'}`} />
          <span id="confirm-dialog-title" className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
            {title}
          </span>
        </div>
        <div className="p-6 space-y-5">
          <p className="text-sm font-medium text-gray-800">{message}</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-lg border border-amber-400 bg-white py-2.5 text-sm font-bold text-gray-700 hover:bg-amber-50 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              autoFocus
              className={`flex-1 rounded-lg py-2.5 text-sm font-extrabold text-white shadow transition active:scale-[0.98] ${
                danger ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const BASE_TABS = ['Add Winner', 'Make PDF', 'Ticket']
const SUPERADMIN_TAB = 'Manage Subadmins'
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^[+]?[0-9]{7,15}$/
const TICKET_REGEX = /^[A-Za-z0-9](?:[A-Za-z0-9\s-]{1,18})[A-Za-z0-9]$/

// ---------- validation helpers ----------
function validateName(value) {
  const v = value.trim()
  if (!v) return 'Name is required.'
  if (v.length < 2) return 'Name must be at least 2 characters.'
  if (v.length > 80) return 'Name is too long.'
  return ''
}

function validatePhone(value) {
  const v = value.trim()
  if (!v) return 'Phone number is required.'
  const digitsOnly = v.replace(/[\s-]/g, '')
  if (!PHONE_REGEX.test(digitsOnly)) return 'Enter a valid phone number (7–15 digits, optional +).'
  return ''
}

function validateTicket(value) {
  const v = value.trim()
  if (!v) return 'Ticket number is required.'
  if (!TICKET_REGEX.test(v)) return 'Ticket number looks invalid (letters/numbers, 3–20 characters).'
  return ''
}

function validateEmail(value) {
  const v = value.trim().toLowerCase()
  if (!v) return 'Email is required.'
  if (!EMAIL_REGEX.test(v)) return 'Please enter a valid email address.'
  return ''
}

function validateSubPassword(value) {
  if (!value || value.length < 6) return 'Password must be at least 6 characters.'
  return ''
}

export function Admin() {
  const navigate = useNavigate()

  // ---------- auth/session ----------
  const [session, setSession] = useState(lotteryUtils.getAdminSession())
  const authed = !!session?.token
  const isSuperAdmin = session?.role === 'superadmin'

  const [loginEmail, setLoginEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(false)
  const [loginValidationError, setLoginValidationError] = useState('')
  const [apiError, setApiError] = useState(false)
  const [loading, setLoading] = useState(false)

  // ---------- tabs ----------
  const TABS = isSuperAdmin ? [...BASE_TABS, SUPERADMIN_TAB] : BASE_TABS
  const [activeTab, setActiveTab] = useState(0)

  // ---------- winners: add form ----------
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [ticketNumber, setTicketNumber] = useState('')
  const [winnerError, setWinnerError] = useState('')
  const [winners, setWinners] = useState([])

  // ---------- winners: edit form ----------
  const [editingIndex, setEditingIndex] = useState(null)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editTicketNumber, setEditTicketNumber] = useState('')
  const [editPosition, setEditPosition] = useState('5Th')
  const [editError, setEditError] = useState('')

  // ---------- subadmin management ----------
  const [subUsers, setSubUsers] = useState([])
  const [newSubEmail, setNewSubEmail] = useState('')
  const [newSubPassword, setNewSubPassword] = useState('')
  const [subError, setSubError] = useState('')
  const [subMessage, setSubMessage] = useState('')
  const [subLoading, setSubLoading] = useState(false)

  // ---------- confirmation dialog ----------
  const [confirmState, setConfirmState] = useState(null) // { title, message, confirmLabel, danger, onConfirm }

  function requestConfirm({ title, message, confirmLabel, danger, onConfirm }) {
    setConfirmState({ title, message, confirmLabel, danger, onConfirm })
  }

  function closeConfirm() {
    setConfirmState(null)
  }

  function runConfirmedAction() {
    const action = confirmState?.onConfirm
    closeConfirm()
    if (typeof action === 'function') action()
  }

  useEffect(() => {
    async function loadWinners() {
      try {
        const response = await fetch('/api/winners')
        if (!response.ok) return
        const data = await response.json()
        setWinners(data.winners || [])
      } catch (error) {
        console.error(error)
      }
    }
    loadWinners()
  }, [])

  useEffect(() => {
    if (!authed) return
    if (activeTab >= TABS.length) setActiveTab(0)
  }, [authed, TABS.length, activeTab])

  useEffect(() => {
    if (isSuperAdmin) loadSubUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuperAdmin])

  // ---------- auth actions ----------
  async function doLogin(e) {
    e.preventDefault()
    setLoginError(false)
    setApiError(false)
    setLoginValidationError('')

    const emailErr = validateEmail(loginEmail)
    if (emailErr) {
      setLoginValidationError(emailErr)
      return
    }
    if (!password) {
      setLoginValidationError('Password is required.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.trim().toLowerCase(), password }),
      })
      const data = await response.json()
      if (!response.ok || !data.ok) {
        setLoginError(true)
        return
      }
      const newSession = { token: data.token, email: data.email, role: data.role }
      lotteryUtils.setAdminAuth(newSession)
      setSession(newSession)
      setPassword('')
      setActiveTab(0)
    } catch (error) {
      console.error(error)
      setApiError(true)
    } finally {
      setLoading(false)
    }
  }

  function doLogout() {
    requestConfirm({
      title: 'Log Out',
      message: 'Are you sure you want to log out of the admin portal?',
      confirmLabel: 'Log Out',
      danger: false,
      onConfirm: () => {
        fetch('/api/admin/logout', {
          method: 'POST',
          headers: lotteryUtils.authHeaders(),
        }).catch(() => {})
        lotteryUtils.setAdminAuth(null)
        setSession(null)
      },
    })
  }

  // ---------- winner actions ----------
  async function addWinner(e) {
    e.preventDefault()
    const n = name.trim(), p = phone.trim(), ticket = ticketNumber.trim()

    const nameErr = validateName(n)
    const phoneErr = validatePhone(p)
    const ticketErr = validateTicket(ticket)
    const firstError = nameErr || phoneErr || ticketErr
    if (firstError) {
      setWinnerError(firstError)
      return
    }
    setWinnerError('')
    setApiError(false)

    requestConfirm({
      title: 'Add Winner',
      message: `Add "${n}" as a winner with ticket ${ticket}?`,
      confirmLabel: 'Add Winner',
      danger: false,
      onConfirm: async () => {
        try {
          const response = await fetch('/api/winners', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...lotteryUtils.authHeaders() },
            body: JSON.stringify({ name: n, phone: p, ticketNumber: ticket, position: '5Th' }),
          })
          if (!response.ok) { setApiError(true); return }
          const data = await response.json()
          setWinners(data.winners || [])
          setName(''); setPhone(''); setTicketNumber('')
          cancelEdit()
          // navigate('/winners')
        } catch (error) {
          console.error(error)
          setApiError(true)
        }
      },
    })
  }

  function startEdit(index) {
    const winner = winners[index]
    if (!winner) return
    setEditingIndex(index)
    setEditName(winner.name || '')
    setEditPhone(winner.phone || '')
    setEditTicketNumber(winner.ticketNumber || '')
    setEditPosition(winner.position || '5Th')
    setEditError('')
    setWinnerError('')
    setApiError(false)
  }

  function cancelEdit() {
    setEditingIndex(null)
    setEditName('')
    setEditPhone('')
    setEditTicketNumber('')
    setEditPosition('5Th')
    setEditError('')
  }

  async function updateWinner(index) {
    const n = editName.trim(), p = editPhone.trim(), ticket = editTicketNumber.trim(), position = editPosition.trim() || '5Th'

    const nameErr = validateName(n)
    const phoneErr = validatePhone(p)
    const ticketErr = validateTicket(ticket)
    const firstError = nameErr || phoneErr || ticketErr
    if (firstError) {
      setEditError(firstError)
      return
    }
    setEditError('')
    setApiError(false)

    requestConfirm({
      title: 'Save Changes',
      message: `Save changes to "${n}" (ticket ${ticket})?`,
      confirmLabel: 'Save Changes',
      danger: false,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/winners/${index}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...lotteryUtils.authHeaders() },
            body: JSON.stringify({ name: n, phone: p, ticketNumber: ticket, position }),
          })
          if (!response.ok) { setApiError(true); return }
          const data = await response.json()
          setWinners(data.winners || [])
          cancelEdit()
        } catch (error) {
          console.error(error)
          setApiError(true)
        }
      },
    })
  }

  function deleteWinner(index) {
    const winner = winners[index]
    setApiError(false)
    requestConfirm({
      title: 'Delete Winner',
      message: `Delete winner "${winner?.name || 'this entry'}" (ticket ${winner?.ticketNumber || '—'})? This cannot be undone.`,
      confirmLabel: 'Delete',
      danger: true,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/winners/${index}`, {
            method: 'DELETE',
            headers: lotteryUtils.authHeaders(),
          })
          if (!response.ok) { setApiError(true); return }
          const data = await response.json()
          setWinners(data.winners || [])
          if (editingIndex === index) cancelEdit()
        } catch (error) {
          console.error(error)
          setApiError(true)
        }
      },
    })
  }

  // ---------- subadmin actions ----------
  async function loadSubUsers() {
    try {
      const response = await fetch('/api/admin/users', { headers: lotteryUtils.authHeaders() })
      if (!response.ok) return
      const data = await response.json()
      setSubUsers(data.users || [])
    } catch (error) {
      console.error(error)
    }
  }

  function createSubUser(e) {
    e.preventDefault()
    setSubError('')
    setSubMessage('')
    const email = newSubEmail.trim().toLowerCase()
    const p = newSubPassword

    const emailErr = validateEmail(email)
    if (emailErr) {
      setSubError(emailErr)
      return
    }
    const passErr = validateSubPassword(p)
    if (passErr) {
      setSubError(passErr)
      return
    }
    if (subUsers.some((u) => u.email?.toLowerCase() === email)) {
      setSubError('A subadmin with this email already exists.')
      return
    }

    requestConfirm({
      title: 'Create Subadmin',
      message: `Create a new subadmin account for "${email}"?`,
      confirmLabel: 'Create',
      danger: false,
      onConfirm: async () => {
        setSubLoading(true)
        try {
          const response = await fetch('/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...lotteryUtils.authHeaders() },
            body: JSON.stringify({ email, password: p }),
          })
          const data = await response.json()
          if (!response.ok || !data.ok) {
            setSubError(data.message || 'Unable to create subadmin.')
            return
          }
          setSubUsers(data.users || [])
          setNewSubEmail('')
          setNewSubPassword('')
          setSubMessage('Subadmin created successfully.')
        } catch (error) {
          console.error(error)
          setSubError('Unable to reach the server.')
        } finally {
          setSubLoading(false)
        }
      },
    })
  }

  function deleteSubUser(email) {
    setSubError('')
    setSubMessage('')
    requestConfirm({
      title: 'Remove Subadmin',
      message: `Remove subadmin access for "${email}"? This cannot be undone.`,
      confirmLabel: 'Remove',
      danger: true,
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/admin/users/${encodeURIComponent(email)}`, {
            method: 'DELETE',
            headers: lotteryUtils.authHeaders(),
          })
          const data = await response.json()
          if (!response.ok || !data.ok) {
            setSubError(data.message || 'Unable to delete subadmin.')
            return
          }
          setSubUsers(data.users || [])
          setSubMessage('Subadmin removed.')
        } catch (error) {
          console.error(error)
          setSubError('Unable to reach the server.')
        }
      },
    })
  }

  const inputClass =
    'w-full px-4 py-3 border-2 border-amber-600 rounded-lg bg-white text-sm font-medium text-gray-900 focus:outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-600/20 transition'

  // ---------- login screen ----------
  if (!authed) {
    return (
      <div className="max-w-full lg:max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <HeaderBanner label="Admin Portal · Kerala State Lotteries" />

        <div className="bg-[#fffaf0] border-2 border-amber-400/40 border-t-0 rounded-b-2xl shadow-lg p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-amber-600 flex items-center justify-center shadow text-white text-lg flex-shrink-0">
              🔒
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">Admin Login</h1>
              <p className="text-xs text-gray-500 mt-0.5">Enter your credentials to manage lottery winners.</p>
            </div>
          </div>

          <hr className="border-amber-300/40" />

          <form onSubmit={doLogin} className="space-y-4" autoComplete="off">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@example.com"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            {loginValidationError && <Alert type="red">{loginValidationError}</Alert>}
            {loginError && <Alert type="red">Incorrect email or password. Please try again.</Alert>}
            {apiError && <Alert type="yellow">Unable to reach the server. Please try again later.</Alert>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 active:scale-[0.98] text-white font-extrabold py-3 rounded-lg shadow transition-all duration-150"
            >
              {loading ? 'Logging in…' : 'Log In'}
            </button>

            <p className="text-xs text-gray-400 text-center">Admin login is authenticated via backend service.</p>
          </form>
        </div>
      </div>
    )
  }

  // ---------- authenticated dashboard ----------
  return (
    <div className="max-w-full lg:max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <HeaderBanner label="Admin Portal · Kerala State Lotteries" />

      <div className="bg-[#fffaf0] border-2 border-amber-400/40 border-t-0 rounded-b-2xl shadow-lg p-8 space-y-5">
        {/* Title row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow text-white text-lg flex-shrink-0 ${isSuperAdmin ? 'bg-purple-700' : 'bg-green-700'}`}>
              {isSuperAdmin ? '👑' : '🏆'}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
                {TABS[activeTab] || 'Add Winner'}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Signed in as <span className="font-mono font-semibold">{session.email}</span>{' '}
                <span className={`ml-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${isSuperAdmin ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                  {isSuperAdmin ? 'Superadmin' : 'Subadmin'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 pt-1">
            <button
              onClick={doLogout}
              className="text-xs font-bold text-amber-700 border border-amber-500 px-3 py-1 rounded-md hover:bg-amber-100 transition"
            >
              Log Out
            </button>
          </div>
        </div>

        <hr className="border-amber-300/40" />

        {/* Tabs */}
        <div className="flex gap-1 border-b-2 border-amber-200 flex-wrap">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wide border-b-2 -mb-0.5 transition ${
                activeTab === i
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-gray-400 hover:text-amber-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Add Winner tab */}
        {activeTab === 0 && (
          <>
            <form onSubmit={addWinner} className="space-y-4" autoComplete="off">
              <div>
                <label htmlFor="name" className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  Winner Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name of the winner"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 00000 00000"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="ticket" className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  Ticket Number
                </label>
                <input
                  id="ticket"
                  type="text"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  placeholder="e.g. SS 123456"
                  className={inputClass}
                  required
                />
              </div>

              {winnerError && <Alert type="red">{winnerError}</Alert>}
              {apiError && <Alert type="yellow">Unable to save winner. Please try again.</Alert>}

              <button
                type="submit"
                className="w-full bg-green-700 hover:bg-green-800 active:scale-[0.98] text-white font-extrabold py-3 rounded-lg shadow transition-all duration-150"
              >
                🏆 &nbsp;Add Winner
              </button>
            </form>

            {winners.length > 0 && (
              <div className="mt-10 overflow-x-auto rounded-3xl border border-amber-200 bg-white p-4 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">Winner Management</h2>
                {editingIndex !== null && editError && (
                  <div className="mb-4">
                    <Alert type="red">{editError}</Alert>
                  </div>
                )}
                <table className="min-w-full divide-y divide-amber-200 text-sm">
                  <thead className="bg-amber-100 text-left text-xs uppercase tracking-wide text-amber-700">
                    <tr>
                      <th className="px-3 py-3">#</th>
                      <th className="px-3 py-3">Name</th>
                      <th className="px-3 py-3">Phone</th>
                      <th className="px-3 py-3">Ticket</th>
                      <th className="px-3 py-3">Position</th>
                      <th className="px-3 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-200">
                    {winners.map((winner, index) => (
                      <tr key={index} className="bg-white">
                        <td className="px-3 py-3 font-semibold text-slate-800">{index + 1}</td>
                        {editingIndex === index ? (
                          <>
                            <td className="px-3 py-3">
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm"
                              />
                            </td>
                            <td className="px-3 py-3">
                              <input
                                type="tel"
                                value={editPhone}
                                onChange={(e) => setEditPhone(e.target.value)}
                                className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm"
                              />
                            </td>
                            <td className="px-3 py-3">
                              <input
                                type="text"
                                value={editTicketNumber}
                                onChange={(e) => setEditTicketNumber(e.target.value)}
                                className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm"
                              />
                            </td>
                            <td className="px-3 py-3">
                              <input
                                type="text"
                                value={editPosition}
                                onChange={(e) => setEditPosition(e.target.value)}
                                className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm"
                              />
                            </td>
                            <td className="px-3 py-3 space-x-2">
                              <button
                                type="button"
                                onClick={() => updateWinner(index)}
                                className="rounded-full bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="rounded-full bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-300"
                              >
                                Cancel
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-3 py-3 text-slate-700">{winner.name}</td>
                            <td className="px-3 py-3 font-mono text-slate-700">{winner.phone}</td>
                            <td className="px-3 py-3 font-mono text-slate-700">{winner.ticketNumber}</td>
                            <td className="px-3 py-3 text-slate-700">{winner.position || '5Th'}</td>
                            <td className="px-3 py-3 space-x-2">
                              <button
                                type="button"
                                onClick={() => startEdit(index)}
                                className="rounded-full bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-700"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteWinner(index)}
                                className="rounded-full bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Make PDF tab */}
        {activeTab === 1 && (
          <div className="text-center py-8 space-y-3">
            <p className="text-sm text-gray-500">Generate a printable PDF for the current draw results.</p>
            <button
              onClick={() =>
                requestConfirm({
                  title: 'Generate PDF',
                  message: 'Generate a printable PDF for the current draw results?',
                  confirmLabel: 'Generate',
                  danger: false,
                  onConfirm: () => {
                    // PDF generation logic goes here
                  },
                })
              }
              className="bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-extrabold py-3 px-8 rounded-lg shadow transition-all duration-150"
            >
              📄 &nbsp;Make PDF
            </button>
          </div>
        )}

        {/* Ticket tab */}
        {activeTab === 2 && <TicketGenerator />}

        {/* Manage Subadmins tab (superadmin only) */}
        {isSuperAdmin && activeTab === TABS.indexOf(SUPERADMIN_TAB) && (
          <div className="space-y-6">
            <form onSubmit={createSubUser} className="space-y-4" autoComplete="off">
              <div>
                <label htmlFor="subEmail" className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  Subadmin Email
                </label>
                <input
                  id="subEmail"
                  type="email"
                  value={newSubEmail}
                  onChange={(e) => setNewSubEmail(e.target.value)}
                  placeholder="officer@example.com"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="subPassword" className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  id="subPassword"
                  type="password"
                  value={newSubPassword}
                  onChange={(e) => setNewSubPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className={inputClass}
                  required
                />
              </div>

              {subError && <Alert type="red">{subError}</Alert>}
              {subMessage && <Alert type="yellow">{subMessage}</Alert>}

              <button
                type="submit"
                disabled={subLoading}
                className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-purple-300 active:scale-[0.98] text-white font-extrabold py-3 rounded-lg shadow transition-all duration-150"
              >
                {subLoading ? 'Creating…' : '➕ Create Subadmin'}
              </button>
            </form>

            <div className="rounded-3xl border border-amber-200 bg-white p-4 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-gray-900">Subadmins</h2>
              {subUsers.length === 0 ? (
                <p className="text-sm text-gray-500">No subadmins yet. Create one above.</p>
              ) : (
                <table className="min-w-full divide-y divide-amber-200 text-sm">
                  <thead className="bg-amber-100 text-left text-xs uppercase tracking-wide text-amber-700">
                    <tr>
                      <th className="px-3 py-3">Email</th>
                      <th className="px-3 py-3">Created</th>
                      <th className="px-3 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-200">
                    {subUsers.map((u) => (
                      <tr key={u.email} className="bg-white">
                        <td className="px-3 py-3 font-mono text-slate-700">{u.email}</td>
                        <td className="px-3 py-3 text-slate-500">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-3 py-3">
                          <button
                            type="button"
                            onClick={() => deleteSubUser(u.email)}
                            className="rounded-full bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 text-center pt-1">
          All changes are saved to the backend and reflected on the Winners page.
        </p>
      </div>

      {confirmState && (
        <ConfirmDialog
          title={confirmState.title}
          message={confirmState.message}
          confirmLabel={confirmState.confirmLabel}
          danger={confirmState.danger}
          onConfirm={runConfirmedAction}
          onCancel={closeConfirm}
        />
      )}
    </div>
  )
}