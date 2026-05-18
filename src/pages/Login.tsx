import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { SESSION_AUTH_VERSION, demoPasswordHint, validateLoginPassword } from '../lib/authLogin'
import type { Role } from '../lib/types'
import { setSession } from '../lib/storage'

export function Login() {
  const nav = useNavigate()
  const [role, setRole] = useState<Role>('student')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!validateLoginPassword(role, password)) {
      setError('Incorrect password for this role. Check your class credentials or .env settings.')
      return
    }
    const n = name.trim() || (role === 'faculty' ? 'Faculty user' : 'Student user')
    setSession({ role, name: n, authVersion: SESSION_AUTH_VERSION })
    nav('/app/guide', { replace: true })
  }

  return (
    <div className="login-page">
      <div className="login-shell">
        <aside className="login-hero" aria-hidden="false">
          <div className="login-hero-content">
            <div className="login-hero-icon" aria-hidden>
              🦷
            </div>
            <h1>Interactive Oral Pathology Education</h1>
            <p>
              Learn odontogenic pathology with quizzes, 3D models, computer vision labs, and
              AR-style preparation—all in one beautiful study hub.
            </p>
            <ul className="login-feature-list">
              <li>Faculty PDF → auto-generated quizzes</li>
              <li>Student labs: CV, 3D, AR & image drills</li>
              <li>Bookmarks, notes & offline chatbot</li>
            </ul>
          </div>
        </aside>

        <div className="card login-card">
          <h2>Welcome back</h2>
          <p className="login-sub">Sign in with your role, display name, and class password.</p>
          <form onSubmit={onSubmit} className="stack">
            <label className="field">
              <span>Role</span>
              <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </label>
            <label className="field">
              <span>Display name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'faculty' ? 'Dr. Example' : 'Your name'}
                autoComplete="name"
              />
            </label>
            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Class or demo password"
                autoComplete="current-password"
              />
            </label>
            {error && <p className="error small">{error}</p>}
            <button type="submit" className="btn primary">
              Log in
            </button>
          </form>
          <p className="small muted">{demoPasswordHint()}</p>
        </div>
      </div>
    </div>
  )
}
