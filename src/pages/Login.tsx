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
      <div className="card login-card">
        <h1>Interactive Oral Pathology Education</h1>
        <p className="muted">
          LMS-style roles (student / faculty): learning content, quizzes, and progress stay in this
          browser—similar to the chapter / topic / test workflow in your course design. Sign in with
          your display name and password.
        </p>
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
          {error && <p className="small" style={{ color: 'var(--danger)', margin: 0 }}>{error}</p>}
          <button type="submit" className="btn primary">
            Log in
          </button>
        </form>
        <p className="small muted">{demoPasswordHint()}</p>
        <p className="small muted">
          Demo data stays in this browser (localStorage). No server is required for PDF parsing or
          quizzes. A production system would send credentials to Firebase or another backend;
          here, password checks run only in the browser for the assignment prototype.
        </p>
      </div>
    </div>
  )
}
