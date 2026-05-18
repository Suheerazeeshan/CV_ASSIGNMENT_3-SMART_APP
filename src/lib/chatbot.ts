/** Rule-based assistant + optional Gemini (app-aware). */

import { generateGeminiContent } from './geminiGenerate'

const APP_GUIDE = `
This web app is "Oral Pathology Edu" (browser-only, no server database).

FACULTY:
- Login: role Faculty, password demo123 (unless .env overrides).
- PDF → Quiz generator (/app/faculty/upload): upload lecture PDF → text extracted in browser → MCQ quiz generated from that lecture → saved in browser localStorage.
- Quizzes & solutions (/app/faculty/quizzes): answer keys.
- Reports (/app/faculty/reports): table of student quiz attempts and scores (same browser only).

STUDENT:
- Quizzes (/app/student/quizzes): take faculty-generated quizzes; lecture text shown if faculty uploaded PDF.
- Reading, lectures, 3D models, AR lab, CV lab, sample quiz, results.

QUIZ GENERATION (this app, not generic AI):
- Instant mode: picks sentences from PDF text, builds 4-option MCQs locally.
- AI mode: sends lecture excerpt to Google Gemini API if VITE_GEMINI_API_KEY is set.
- Questions are saved with lecture text so students can read the material before the quiz.

LIMITS: All data is in localStorage on one device/browser; not synced to cloud.
`.trim()

const FAQ: { keys: string[]; reply: string }[] = [
  {
    keys: ['how this app', 'how does the app', 'how app work', 'what is this app', 'how it works'],
    reply:
      'This app runs in your browser. Faculty upload a lecture PDF → the app builds a quiz from that lecture. Students read the lecture and take the quiz. You also get reading notes, 3D models, AR prep, and a CV image lab. Data stays on this device (localStorage)—not a cloud server.',
  },
  {
    keys: ['how quiz', 'quiz generated', 'quiz generate', 'generate quiz', 'pdf quiz'],
    reply:
      'Faculty: go to PDF → Quiz generator, upload a lecture PDF. The app extracts text in the browser and creates multiple-choice questions from that lecture (Instant = local rules, AI = Gemini if API key is set). The lecture text is saved with the quiz. Students see it under Student → Quizzes.',
  },
  {
    keys: ['progress', 'report', 'faculty show', 'student score', 'performance'],
    reply:
      'Faculty → Performance reports shows every student attempt: name, quiz title, score (e.g. 6/8), and date. It only includes attempts on this same browser. For answer keys, use Faculty → Quizzes & solutions.',
  },
  {
    keys: ['faculty', 'teacher', 'instructor'],
    reply:
      'Faculty tools: (1) Upload lecture PDF → auto quiz, (2) Quizzes & solutions for answer keys, (3) Reports for student scores, (4) Preview student hub. Path: Faculty dashboard in the sidebar.',
  },
  {
    keys: ['student', 'learner', 'take quiz'],
    reply:
      'Students: Reading and lectures for notes, Quizzes for faculty tests (read lecture first if provided), Sample quiz for practice, Results for your scores, plus 3D models, AR prep, and CV lab.',
  },
  {
    keys: ['gemini', 'api key', 'vite_gemini'],
    reply:
      'Optional: add VITE_GEMINI_API_KEY to oral-pathology-edu/.env and restart npm run dev. Then the Study chatbot and PDF quiz "AI mode" use Google Gemini. Without a key, the chatbot uses built-in answers and quizzes use Instant (local) mode.',
  },
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
    keys: ['ar', 'augmented'],
    reply:
      'Student → AR prep lab: use a photo or live camera, align the jaw overlay, and practice lesion regions. Works best with the built-in jaw sketch or your own dental photo.',
  },
  {
    keys: ['3d', 'model', 'glb'],
    reply:
      'Student → 3D models: orbit/zoom dental meshes. Faculty can upload .glb files. Default includes teeth/jaw teaching models.',
  },
]

export function localBotAnswer(message: string): string | null {
  const m = message.toLowerCase()
  for (const row of FAQ) {
    if (row.keys.some((k) => m.includes(k))) return row.reply
  }
  return null
}

export async function geminiAnswer(message: string): Promise<string | null> {
  const body = {
    contents: [
      {
        parts: [
          {
            text:
              'You are the help assistant for the Oral Pathology Edu web app (odontogenic pathology course).\n' +
              'Answer in under 120 words. Be specific about THIS app\'s menus and workflow when asked how features work.\n' +
              'Do not claim you personally generate quizzes; explain the app\'s PDF upload and quiz generator instead.\n\n' +
              APP_GUIDE +
              '\n\nUser question: ' +
              message,
          },
        ],
      },
    ],
  }
  const result = await generateGeminiContent(body)
  return result.ok ? result.text : null
}

/** Prefer built-in app answers; use Gemini only when no FAQ match. */
export async function chatbotReply(message: string): Promise<string> {
  const local = localBotAnswer(message)
  if (local) return local

  try {
    const g = await geminiAnswer(message)
    if (g) return g
  } catch {
    /* fall through */
  }

  return (
    'I can help with: how this app works, how faculty generate quizzes from PDFs, student quizzes, ' +
    'faculty reports/scores, odontogenic cysts, ameloblastoma, keratocysts, AR lab, or 3D models. ' +
    'Try: "How are quizzes generated?" or "How do faculty see progress reports?"'
  )
}
