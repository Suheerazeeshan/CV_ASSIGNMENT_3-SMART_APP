import { v4 as uuidv4 } from 'uuid'
import type { Quiz, QuizOption, QuizQuestion } from './types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 50 && s.length <= 400)
}

function pickDistractors(correct: string, pool: string[], count: number): string[] {
  const out: string[] = []
  const filtered = pool.filter((p) => p !== correct && p.length >= 30)
  const shuffled = shuffle(filtered)
  for (const s of shuffled) {
    if (out.length >= count) break
    if (!out.includes(s)) out.push(s.slice(0, 220) + (s.length > 220 ? '…' : ''))
  }
  while (out.length < count) {
    out.push(
      'This statement is not supported by the uploaded document.',
    )
  }
  return out.slice(0, count)
}

/** Builds MCQs from PDF plain text (heuristic; no external AI required). */
export function generateQuizFromText(
  rawText: string,
  title: string,
  sourcePdfName: string,
  maxQuestions = 8,
): Quiz {
  const sents = sentences(rawText)
  if (sents.length < 4) {
    throw new Error(
      'Not enough readable text in the PDF. Try a text-based PDF or a longer document.',
    )
  }

  const chosen = shuffle(sents).slice(0, Math.min(maxQuestions, sents.length))
  const questions: QuizQuestion[] = chosen.map((correctSentence) => {
    const correct =
      correctSentence.length > 280 ? correctSentence.slice(0, 277) + '…' : correctSentence
    const wrong = pickDistractors(correctSentence, sents, 3)
    const optionsRaw = shuffle([
      { text: correct, correct: true },
      ...wrong.map((w) => ({ text: w, correct: false })),
    ])
    const options: QuizOption[] = optionsRaw.map((o) => ({
      id: uuidv4(),
      text: o.text,
    }))
    const ci = optionsRaw.findIndex((o) => o.correct)
    const correctOptionId = options[ci]?.id ?? options[0].id

    return {
      id: uuidv4(),
      prompt: 'Which statement is supported by the uploaded teaching material?',
      options,
      correctOptionId,
    }
  })

  return {
    id: uuidv4(),
    title,
    sourcePdfName,
    questions,
    createdAt: new Date().toISOString(),
  }
}
