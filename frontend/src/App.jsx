import { AnimatePresence } from 'framer-motion'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/AuthContext'
import AppLayout from './layouts/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import StudentsPage from './pages/StudentsPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import ErrorPage from './pages/ErrorPage'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

export default function App() {
  return <AuthProvider><BrowserRouter><AnimatePresence mode="wait"><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route element={<ProtectedRoute />}><Route element={<AppLayout />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/students" element={<StudentsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Route></Route>
    <Route path="/unauthorized" element={<ErrorPage code="401" />} />
    <Route path="*" element={<ErrorPage code="404" />} />
  </Routes></AnimatePresence><ToastContainer position="top-right" autoClose={3500} theme="colored" /></BrowserRouter></AuthProvider>
}
