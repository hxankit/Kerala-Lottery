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

const TABS = ['Add Winner', 'Make PDF', 'Ticket']

export function Admin() {
  const navigate = useNavigate()
  const [authed, setAuthed] = useState(lotteryUtils.isAdmin())
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(false)
  const [apiError, setApiError] = useState(false)
  const [loading, setLoading] = useState(false)

  const [activeTab, setActiveTab] = useState(0)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [ticketNumber, setTicketNumber] = useState('')
  const [winnerError, setWinnerError] = useState(false)
  const [winners, setWinners] = useState([])

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

  async function doLogin(e) {
    e.preventDefault()
    setLoading(true)
    setLoginError(false)
    setApiError(false)
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!response.ok) { setLoginError(true); return }
      const data = await response.json()
      if (data.ok) {
        lotteryUtils.setAdminAuth(true)
        setAuthed(true)
        setPassword('')
      } else {
        setLoginError(true)
      }
    } catch (error) {
      console.error(error)
      setApiError(true)
    } finally {
      setLoading(false)
    }
  }

  function doLogout() {
    lotteryUtils.setAdminAuth(false)
    setAuthed(false)
  }

  async function addWinner(e) {
    e.preventDefault()
    const n = name.trim(), p = phone.trim(), ticket = ticketNumber.trim()
    if (!n || !p || !ticket) { setWinnerError(true); return }
    setWinnerError(false)
    setApiError(false)
    try {
      const response = await fetch('/api/winners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: n, phone: p, ticketNumber: ticket, position: '5Th' }),
      })
      if (!response.ok) { setApiError(true); return }
      const data = await response.json()
      setWinners(data.winners || [])
      setName(''); setPhone(''); setTicketNumber('')
      // navigate('/winners')
    } catch (error) {
      console.error(error)
      setApiError(true)
    }
  }

  const inputClass =
    'w-full px-4 py-3 border-2 border-amber-600 rounded-lg bg-white text-sm font-medium text-gray-900 focus:outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-600/20 transition'

  if (!authed) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <HeaderBanner label="Admin Portal · Kerala State Lotteries" />

        <div className="bg-[#fffaf0] border-2 border-amber-400/40 border-t-0 rounded-b-2xl shadow-lg p-8 space-y-5">
          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-amber-600 flex items-center justify-center shadow text-white text-lg flex-shrink-0">
              🔒
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">Admin Login</h1>
              <p className="text-xs text-gray-500 mt-0.5">Enter your password to manage lottery winners.</p>
            </div>
          </div>

          <hr className="border-amber-300/40" />

          <form onSubmit={doLogin} className="space-y-4" autoComplete="off">
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

            {loginError && <Alert type="red">Incorrect password. Please try again.</Alert>}
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

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <HeaderBanner label="Admin Portal · Kerala State Lotteries" />

      <div className="bg-[#fffaf0] border-2 border-amber-400/40 border-t-0 rounded-b-2xl shadow-lg p-8 space-y-5">
        {/* Title row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-green-700 flex items-center justify-center shadow text-white text-lg flex-shrink-0">
              🏆
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">Add Winner</h1>
              <p className="text-xs text-gray-500 mt-0.5">Authenticated as administrator</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 pt-1">
            {/* <span className="inline-flex items-center gap-1.5 bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
              {winners.length} saved
            </span> */}
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
        <div className="flex gap-1 border-b-2 border-amber-200">
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

        {/* Add Winner form */}
        {activeTab === 0 && (
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

            {winnerError && <Alert type="red">Please fill in name, phone number, and ticket number.</Alert>}
            {apiError && <Alert type="yellow">Unable to save winner. Please try again.</Alert>}

            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 active:scale-[0.98] text-white font-extrabold py-3 rounded-lg shadow transition-all duration-150"
            >
              🏆 &nbsp;Add Winner
            </button>
          </form>
        )}

        {/* Make PDF tab */}
        {activeTab === 1 && (
          <div className="text-center py-8 space-y-3">
            <p className="text-sm text-gray-500">Generate a printable PDF for the current draw results.</p>
            <button className="bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-extrabold py-3 px-8 rounded-lg shadow transition-all duration-150">
              📄 &nbsp;Make PDF
            </button>
          </div>
        )}

        {/* Ticket tab */}
        {activeTab === 2 && <TicketGenerator />}

        <p className="text-xs text-gray-400 text-center pt-1">
          All changes are saved to the backend and reflected on the Winners page.
        </p>
      </div>
    </div>
  )
}