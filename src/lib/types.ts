export type Role = 'faculty' | 'student'

export interface Session {
  role: Role
  name: string
  /** Set after successful password login (see authLogin.SESSION_AUTH_VERSION). */
  authVersion?: number
}

export interface QuizOption {
  id: string
  text: string
}

export interface QuizQuestion {
  id: string
  prompt: string
  options: QuizOption[]
  correctOptionId: string
}

export interface Quiz {
  id: string
  title: string
  /** Original lecture PDF filename when faculty uploaded. */
  sourcePdfName?: string
  /** Extracted lecture text used to generate questions (faculty PDF uploads). */
  lectureText?: string
  questions: QuizQuestion[]
  createdAt: string
}

export interface QuizAttempt {
  id: string
  quizId: string
  studentName: string
  score: number
  total: number
  answers: Record<string, string>
  completedAt: string
}
