import type { Quiz } from './types'
import { getQuizzes, saveQuiz } from './storage'

/** True when `sourcePdfName` marks a quiz loaded from `public/quizzes/`. */
export function isPublishedFolderQuiz(q: Quiz): boolean {
  return Boolean(q.sourcePdfName?.startsWith('published/quizzes/'))
}

/** Merge JSON quizzes from `/quizzes/index.json` into localStorage (same bank as faculty PDF quizzes). */
export async function mergeBundledQuizzesFromPublic(): Promise<void> {
  const base = import.meta.env.BASE_URL
  let manifest: { files?: string[] }
  try {
    const res = await fetch(`${base}quizzes/index.json`)
    if (!res.ok) return
    manifest = (await res.json()) as { files?: string[] }
  } catch {
    return
  }
  const files = manifest.files ?? []
  for (const file of files) {
    try {
      const res = await fetch(`${base}quizzes/${file}`)
      if (!res.ok) continue
      const quiz = (await res.json()) as Quiz
      if (!quiz?.id || !Array.isArray(quiz.questions)) continue
      const tagged: Quiz = {
        ...quiz,
        sourcePdfName: `published/quizzes/${file}`,
      }
      saveQuiz(tagged)
    } catch {
      /* skip broken file */
    }
  }
}

/** Quizzes shipped in `public/quizzes/` for student practice + faculty solutions. */
export function getPublishedFolderQuizzes(): Quiz[] {
  return getQuizzes().filter(isPublishedFolderQuiz)
}
