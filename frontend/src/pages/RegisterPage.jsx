import { useState } from 'react'
import { FaEye, FaEyeSlash, FaLock, FaSpinner, FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Brand from '../components/Brand'

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [show, setShow] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async e => {
    e.preventDefault()
    
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      toast.success('Registration successful! Please login.')
      navigate('/login', { replace: true })
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-art">
        <Brand />
        <div>
          <p className="eyebrow">Student success, simplified</p>
          <h1>Create your<br />records account.</h1>
          <p>Join the community of educators managing student records efficiently.</p>
        </div>
        <small>© {new Date().getFullYear()} SRMS</small>
      </div>
      <main className="login-panel">
        <div className="login-box">
          <Link to="/" className="back-link">← Back to home</Link>
          <h2>Create an account</h2>
          <p>Sign up to get started with your student management system.</p>
          <form onSubmit={submit}>
            <label>
              Email address
              <div className="input-wrap">
                <FaUser />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </label>
            <label>
              Password
              <div className="input-wrap">
                <FaLock />
                <input
                  type={show ? 'text' : 'password'}
                  required
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  aria-label="Show password"
                >
                  {show ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </label>
            <label>
              Confirm Password
              <div className="input-wrap">
                <FaLock />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label="Show password"
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </label>
            <button className="btn btn-primary login-submit" disabled={loading}>
              {loading ? (
                <>
                  <FaSpinner className="spin" /> Creating account…
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>
          <p className="demo-note">Already have an account? <Link to="/login">Sign in instead</Link></p>
        </div>
      </main>
    </div>
  )
}
