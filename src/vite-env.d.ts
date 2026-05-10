/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string
  /** Shared login password for both roles (browser-only demo). */
  readonly VITE_LOGIN_PASSWORD?: string
  readonly VITE_FACULTY_LOGIN_PASSWORD?: string
  readonly VITE_STUDENT_LOGIN_PASSWORD?: string
}
