import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { FaBars, FaChartPie, FaCog, FaPowerOff, FaUserGraduate, FaUserCircle } from 'react-icons/fa'
import Brand from '../components/Brand'
import { useAuth } from '../context/AuthContext'
const links = [{ to: '/dashboard', icon: <FaChartPie />, label: 'Dashboard' }, { to: '/students', icon: <FaUserGraduate />, label: 'Student Management' }, { to: '/profile', icon: <FaUserCircle />, label: 'Profile' }, { to: '/settings', icon: <FaCog />, label: 'Settings' }]
export default function AppLayout() { const [open, setOpen] = useState(false); const { user, logout } = useAuth(); const navigate = useNavigate(); const signOut = () => { logout(); navigate('/login') }
 return <div className="shell"><aside className={`sidebar ${open ? 'open' : ''}`}><Brand /> <nav>{links.map(l => <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}>{l.icon}<span>{l.label}</span></NavLink>)}</nav><button className="logout-link" onClick={signOut}><FaPowerOff /> Logout</button></aside><div className="shell-main"><header className="topbar"><button className="menu-button" onClick={() => setOpen(!open)}><FaBars /></button><div className="topbar-title">Student Record Management System</div><button className="profile-chip" onClick={() => navigate('/profile')}><span>{user?.name?.split(' ').map(p => p[0]).join('').slice(0, 2)}</span><div><strong>{user?.name}</strong><small>{user?.role}</small></div></button></header><main className="page-content"><Outlet /></main></div></div> }
