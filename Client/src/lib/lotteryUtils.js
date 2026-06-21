const MESSAGES_KEY = 'ksl_messages'
const SESSION_KEY = 'ksl_admin_authed'

export const lotteryUtils = {
  getMessages: () => {
    if (typeof window === 'undefined') return []
    try { return JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]') } catch { return [] }
  },
  addMessage: (message) => { if (typeof window === 'undefined') return; const list = lotteryUtils.getMessages(); list.push({ ...message, date: new Date().toISOString() }); localStorage.setItem(MESSAGES_KEY, JSON.stringify(list)) },
  clearMessages: () => { if (typeof window === 'undefined') return; localStorage.removeItem(MESSAGES_KEY) },
  normalizePhone: (p) => String(p || '').replace(/[^0-9]/g, ''),
  isAdmin: () => (typeof window !== 'undefined' ? sessionStorage.getItem(SESSION_KEY) === 'yes' : false),
  setAdminAuth: (authed) => { if (typeof window === 'undefined') return; if (authed) sessionStorage.setItem(SESSION_KEY, 'yes'); else sessionStorage.removeItem(SESSION_KEY) },
}
