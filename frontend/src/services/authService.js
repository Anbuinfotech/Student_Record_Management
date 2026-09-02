import axios from 'axios'
const SESSION_KEY = 'srms-session'
const authService = {
  getSession: () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY)) } catch { return null } },
  login: async ({ email, password, remember }) => {
    try {
      const { data } = await axios.post('http://localhost:8080/api/auth/login', { email, password })
      const user = { name: data.user?.email?.split('@')[0] || email.split('@')[0], email: data.user?.email || email, role: 'Administrator', lastLogin: new Date().toISOString(), remember }
      localStorage.setItem(SESSION_KEY, JSON.stringify(user)); return user
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Unable to login. Please try again.')
    }
  },
  logout: () => localStorage.removeItem(SESSION_KEY)
}
export default authService
