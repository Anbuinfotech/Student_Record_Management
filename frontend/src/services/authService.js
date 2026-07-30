import axios from 'axios'
const SESSION_KEY = 'srms-session'
const authService = {
  getSession: () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY)) } catch { return null } },
  login: async ({ email, password, remember }) => {
    if (import.meta.env.VITE_AUTH_API_URL) {
      const { data } = await axios.post(`${import.meta.env.VITE_AUTH_API_URL}/auth/login`, { email, password })
      const user = { name: data.user?.name || email.split('@')[0], email, role: data.user?.role || 'Administrator', token: data.token, lastLogin: new Date().toISOString() }
      localStorage.setItem(SESSION_KEY, JSON.stringify(user)); return user
    }
    // Development fallback keeps the existing backend API unchanged. Replace with VITE_AUTH_API_URL in production.
    if (email !== 'admin@srms.com' || password !== 'Admin@123') throw new Error('Use admin@srms.com and Admin@123 for local development.')
    const user = { name: 'System Administrator', email, role: 'Administrator', lastLogin: new Date().toISOString(), remember }
    localStorage.setItem(SESSION_KEY, JSON.stringify(user)); return user
  },
  logout: () => localStorage.removeItem(SESSION_KEY)
}
export default authService
