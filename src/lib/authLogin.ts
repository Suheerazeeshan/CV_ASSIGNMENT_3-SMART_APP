import type { Role, Session } from './types'

/** Bump when login rules change so stale localStorage sessions are rejected. */
export const SESSION_AUTH_VERSION = 2 as const

const DEFAULT_DEMO_PASSWORD = 'demo123'

export function isAuthenticatedSession(s: Session | null): boolean {
  return !!s && s.authVersion === SESSION_AUTH_VERSION && !!s.name?.trim()
}

/**
 * Password check for the browser-only prototype. Set VITE_LOGIN_PASSWORD or per-role
 * overrides in .env for your class; otherwise the default demo password applies.
 */
export function validateLoginPassword(role: Role, password: string): boolean {
  const p = password.trim()
  if (!p) return false

  const shared = import.meta.env.VITE_LOGIN_PASSWORD?.trim()
  const facultyPw = import.meta.env.VITE_FACULTY_LOGIN_PASSWORD?.trim()
  const studentPw = import.meta.env.VITE_STUDENT_LOGIN_PASSWORD?.trim()

  if (role === 'faculty') {
    if (facultyPw) return p === facultyPw
    if (shared) return p === shared
    return p === DEFAULT_DEMO_PASSWORD
  }

  if (studentPw) return p === studentPw
  if (shared) return p === shared
  return p === DEFAULT_DEMO_PASSWORD
}

export function demoPasswordHint(): string {
  if (import.meta.env.VITE_LOGIN_PASSWORD?.trim()) return 'Use the password set in VITE_LOGIN_PASSWORD.'
  if (import.meta.env.VITE_FACULTY_LOGIN_PASSWORD?.trim())
    return 'Use the faculty password from VITE_FACULTY_LOGIN_PASSWORD.'
  if (import.meta.env.VITE_STUDENT_LOGIN_PASSWORD?.trim())
    return 'Use the student password from VITE_STUDENT_LOGIN_PASSWORD.'
  return `Default demo password is "${DEFAULT_DEMO_PASSWORD}" unless overridden in .env.`
}
