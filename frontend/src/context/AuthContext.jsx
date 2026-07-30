import { createContext, useContext, useEffect, useState } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getSession())
  const [theme, setTheme] = useState(() => localStorage.getItem('srms-theme') || 'light')
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('srms-theme', theme) }, [theme])
  const login = async (credentials) => { const loggedInUser = await authService.login(credentials); setUser(loggedInUser); return loggedInUser }
  const logout = () => { authService.logout(); setUser(null) }
  return <AuthContext.Provider value={{ user, login, logout, theme, setTheme }}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
