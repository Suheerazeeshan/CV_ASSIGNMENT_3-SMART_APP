/** Rule-based assistant for odontogenic oral pathology study (offline). */

import { generateGeminiContent } from './geminiGenerate'

const FAQ: { keys: string[]; reply: string }[] = [
  {
    keys: ['odontogenic', 'cyst', 'cysts'],
    reply:
      'Odontogenic cysts arise from epithelium involved in tooth formation. Common examples include radicular (periapical) cysts and dentigerous cysts associated with impacted teeth. Clinical correlation with radiographs and histology is essential.',
  },
  {
    keys: ['ameloblastoma'],
    reply:
      'Ameloblastoma is the most common benign odontogenic tumor of epithelial origin. It tends to occur in the mandible and can be locally aggressive. Treatment planning typically involves surgical excision with margins guided by imaging.',
  },
  {
    keys: ['keratocyst', 'odontogenic keratocyst', 'okc'],
    reply:
      'Odontogenic keratocyst (OKC) shows characteristic histology with parakeratinized lining and can behave aggressively with recurrence risk. Follow-up after treatment is important.',
  },
  {
    keys: ['quiz', 'exam', 'study'],
    reply:
      'Use Student → Reading for core notes, Prompting for AI-style study queries, Sample quiz for practice, then Take quiz for graded attempts. Faculty can upload PDFs to auto-build quizzes.',
  },
  {
    keys: ['ar', 'augmented'],
    reply:
      'Open Student → AR prep lab: allow camera access, align the on-screen overlay with your printed marker or jaw model, and review labeled regions as an augmented study aid.',
  },
  {
    keys: ['faculty', 'pdf', 'upload'],
    reply:
      'Faculty: Upload PDF extracts text locally in the browser, generates MCQs, and saves quizzes for students. View Reports for attempt scores and Solution review for answer keys.',
  },
]

export function localBotAnswer(message: string): string {
  const m = message.toLowerCase()
  for (const row of FAQ) {
    if (row.keys.some((k) => m.includes(k))) return row.reply
  }
  return (
    'I can help with odontogenic pathology topics, quiz workflow, AR prep, or faculty PDF quizzes. ' +
    'Try asking about cysts, ameloblastoma, keratocysts, or how to use the app.'
  )
}

export async function geminiAnswer(message: string): Promise<string | null> {
  const body = {
    contents: [
      {
        parts: [
          {
            text:
              'You are a concise dental education tutor for odontogenic oral pathology. ' +
              'Answer in under 120 words. User: ' +
              message,
          },
        ],
      },
    ],
  }
  const result = await generateGeminiContent(body)
  return result.ok ? result.text : null
}
