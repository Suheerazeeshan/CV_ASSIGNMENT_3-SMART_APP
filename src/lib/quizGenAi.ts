import { v4 as uuidv4 } from 'uuid'
import { generateGeminiContent, getGeminiApiKey } from './geminiGenerate'
import type { Quiz, QuizQuestion } from './types'
import { generateQuizFromText } from './quizGen'

type AiQuizPayload = {
  questions?: {
    prompt?: string
    options?: string[]
    correctIndex?: number
  }[]
}

function parseAiJson(text: string): AiQuizPayload {
  const trimmed = text.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const raw = fenced ? fenced[1].trim() : trimmed
  return JSON.parse(raw) as AiQuizPayload
}

function payloadToQuestions(payload: AiQuizPayload, maxQuestions: number): QuizQuestion[] {
  const items = payload.questions ?? []
  if (!items.length) throw new Error('AI returned no questions.')

  return items.slice(0, maxQuestions).map((q) => {
    const optionsText = (q.options ?? []).filter((o) => o?.trim()).slice(0, 4)
    while (optionsText.length < 4) {
      optionsText.push(`Option ${optionsText.length + 1}`)
    }
    const correctIndex = Math.min(Math.max(0, q.correctIndex ?? 0), optionsText.length - 1)
    const options = optionsText.map((text) => ({ id: uuidv4(), text: text.trim() }))
    return {
      id: uuidv4(),
      prompt: (q.prompt ?? 'Question').trim(),
      options,
      correctOptionId: options[correctIndex]?.id ?? options[0].id,
    }
  })
}

/** AI quiz from lecture text (Gemini). Falls back to local heuristic if no API key. */
export async function generateQuizFromTextWithAi(
  rawText: string,
  title: string,
  sourcePdfName: string,
  maxQuestions = 8,
): Promise<{ quiz: Quiz; usedAi: boolean }> {
  if (!getGeminiApiKey()) {
    return {
      quiz: generateQuizFromText(rawText, title, sourcePdfName, maxQuestions),
      usedAi: false,
    }
  }

  const excerpt = rawText.replace(/\s+/g, ' ').trim().slice(0, 14_000)

  const result = await generateGeminiContent({
    contents: [
      {
        parts: [
          {
            text: `Create ${maxQuestions} multiple-choice questions for dental/oral pathology students using ONLY the lecture text below.

Return JSON only:
{"questions":[{"prompt":"question text","options":["A","B","C","D"],"correctIndex":0}]}

Rules:
- Exactly 4 options per question; correctIndex 0-3
- Test understanding of key facts in the text
- Do not invent content outside the text
- Clear, professional wording

LECTURE:
${excerpt}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.35,
      responseMimeType: 'application/json',
    },
  })

  if (!result.ok) {
    throw new Error(result.message)
  }

  try {
    const payload = parseAiJson(result.text)
    const questions = payloadToQuestions(payload, maxQuestions)
    const quiz: Quiz = {
      id: uuidv4(),
      title,
      sourcePdfName,
      questions,
      createdAt: new Date().toISOString(),
    }
    return { quiz, usedAi: true }
  } catch {
    throw new Error('AI quiz format was invalid. Try again or use Instant (local) mode.')
  }
}

export function hasAiQuizGeneration(): boolean {
  return Boolean(getGeminiApiKey())
}
