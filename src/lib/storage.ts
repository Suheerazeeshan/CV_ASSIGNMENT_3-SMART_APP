import type { Quiz, QuizAttempt, Session } from './types'

const SESSION = 'ope_session'
const QUIZZES = 'ope_quizzes'
const ATTEMPTS = 'ope_attempts'

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION)
    if (!raw) return null
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

export function setSession(s: Session | null): void {
  if (!s) localStorage.removeItem(SESSION)
  else localStorage.setItem(SESSION, JSON.stringify(s))
}

export function getQuizzes(): Quiz[] {
  try {
    const raw = localStorage.getItem(QUIZZES)
    if (!raw) return []
    return JSON.parse(raw) as Quiz[]
  } catch {
    return []
  }
}

export function saveQuiz(quiz: Quiz): void {
  const list = getQuizzes().filter((q) => q.id !== quiz.id)
  list.push(quiz)
  localStorage.setItem(QUIZZES, JSON.stringify(list))
}

export function getQuiz(id: string): Quiz | undefined {
  return getQuizzes().find((q) => q.id === id)
}

export function getAttempts(): QuizAttempt[] {
  try {
    const raw = localStorage.getItem(ATTEMPTS)
    if (!raw) return []
    return JSON.parse(raw) as QuizAttempt[]
  } catch {
    return []
  }
}

export function saveAttempt(a: QuizAttempt): void {
  const list = getAttempts()
  list.push(a)
  localStorage.setItem(ATTEMPTS, JSON.stringify(list))
}

export function attemptsForStudent(name: string): QuizAttempt[] {
  return getAttempts().filter((x) => x.studentName === name)
}

export function attemptsForQuiz(quizId: string): QuizAttempt[] {
  return getAttempts().filter((x) => x.quizId === quizId)
}
