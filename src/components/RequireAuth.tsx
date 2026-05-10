import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticatedSession } from '../lib/authLogin'
import { getSession } from '../lib/storage'

export function RequireAuth() {
  if (!isAuthenticatedSession(getSession())) return <Navigate to="/" replace />
  return <Outlet />
}

export function FacultyGate() {
  const s = getSession()
  if (!s || s.role !== 'faculty') return <Navigate to="/app/student" replace />
  return <Outlet />
}
