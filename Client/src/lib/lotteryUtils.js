const MESSAGES_KEY = 'ksl_messages'
const SESSION_KEY = 'ksl_admin_session'
const SUPERADMIN_USERNAME = 'superadmin'

function readSession() {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const lotteryUtils = {
  // ---------- messages ----------
  getMessages: () => {
    if (typeof window === 'undefined') return []
    try { return JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]') } catch { return [] }
  },
  addMessage: (message) => {
    if (typeof window === 'undefined') return
    const list = lotteryUtils.getMessages()
    list.push({ ...message, date: new Date().toISOString() })
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(list))
  },
  clearMessages: () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(MESSAGES_KEY)
  },

  // ---------- misc ----------
  normalizePhone: (p) => String(p || '').replace(/[^0-9]/g, ''),

  // ---------- admin session ----------
  // session shape: { token, username, role } where role is 'superadmin' | 'subadmin'
  getAdminSession: () => readSession(),

  setAdminAuth: (session) => {
    if (typeof window === 'undefined') return
    if (session && session.token) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
    } else {
      sessionStorage.removeItem(SESSION_KEY)
    }
  },

  isAdmin: () => !!readSession()?.token,

  isSuperAdmin: () => readSession()?.role === 'superadmin',

  getAdminUsername: () => readSession()?.username || null,

  authHeaders: () => {
    const session = readSession()
    return session?.token ? { Authorization: `Bearer ${session.token}` } : {}
  },

  SUPERADMIN_USERNAME,
}