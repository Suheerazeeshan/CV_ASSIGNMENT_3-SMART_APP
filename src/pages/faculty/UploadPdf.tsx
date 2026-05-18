import { useState } from 'react'
import { Link } from 'react-router-dom'
import { extractTextFromPdfBuffer } from '../../lib/pdfExtract'
import { generateQuizFromText } from '../../lib/quizGen'
import { generateQuizFromTextWithAi, hasAiQuizGeneration } from '../../lib/quizGenAi'
import { SAMPLE_LECTURE_PDF } from '../../data/sampleLecturePdfs'
import { publicAssetUrl } from '../../lib/publicAssetUrl'
import { saveQuiz } from '../../lib/storage'
import type { Quiz } from '../../lib/types'

type GenMode = 'instant' | 'ai'

export function UploadPdf() {
  const [title, setTitle] = useState('New quiz from PDF')
  const [mode, setMode] = useState<GenMode>(hasAiQuizGeneration() ? 'ai' : 'instant')
  const [questionCount, setQuestionCount] = useState(8)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [lastQuiz, setLastQuiz] = useState<Quiz | null>(null)

  const aiAvailable = hasAiQuizGeneration()

  async function buildAndSave(text: string, sourceName: string) {
    const quizTitle = title.trim() || sourceName.replace(/\.pdf$/i, '')
    let quiz: Quiz
    let usedAi = false

    if (mode === 'ai') {
      const result = await generateQuizFromTextWithAi(text, quizTitle, sourceName, questionCount)
      quiz = result.quiz
      usedAi = result.usedAi
    } else {
      quiz = generateQuizFromText(text, quizTitle, sourceName, questionCount)
    }

    const withLecture: Quiz = {
      ...quiz,
      sourcePdfName: sourceName,
      lectureText: text.trim().slice(0, 32_000),
    }
    saveQuiz(withLecture)
    setLastQuiz(withLecture)
    setMsg(
      usedAi
        ? `Quiz generated from your lecture (“${sourceName}”) with ${withLecture.questions.length} questions. Students will see the lecture and quiz under Student → Quizzes.`
        : `Quiz generated from your lecture (“${sourceName}”) with ${withLecture.questions.length} questions. Students will see it under Student → Quizzes.`,
    )
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setErr(null)
    setMsg(null)
    setLastQuiz(null)
    setBusy(true)
    try {
      const buf = await file.arrayBuffer()
      const text = await extractTextFromPdfBuffer(buf)
      await buildAndSave(text, file.name)
    } catch (er: unknown) {
      setErr(er instanceof Error ? er.message : 'Failed to process PDF')
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  async function useSampleLecturePdf() {
    setErr(null)
    setMsg(null)
    setLastQuiz(null)
    setBusy(true)
    try {
      const url = publicAssetUrl(SAMPLE_LECTURE_PDF.file)
      const res = await fetch(url)
      if (!res.ok) throw new Error('Sample PDF not found. Run: npm run sample-pdf')
      const buf = await res.arrayBuffer()
      const text = await extractTextFromPdfBuffer(buf)
      if (!title.trim() || title === 'New quiz from PDF') {
        setTitle(SAMPLE_LECTURE_PDF.defaultQuizTitle)
      }
      await buildAndSave(text, 'odontogenic-oral-pathology-lecture.pdf')
    } catch (er: unknown) {
      setErr(er instanceof Error ? er.message : 'Could not load sample PDF')
    } finally {
      setBusy(false)
    }
  }

  async function quickDemo() {
    setErr(null)
    setMsg(null)
    setLastQuiz(null)
    setBusy(true)
    try {
      const demoText = `
        Odontogenic cysts are epithelial-lined cavities derived from tooth-forming tissues.
        Radicular cysts develop at the apex of a non-vital tooth and are inflammatory in origin.
        Dentigerous cysts surround the crown of an unerupted tooth and are developmental.
        Ameloblastoma is a locally invasive odontogenic tumor commonly affecting the mandible.
        Keratocystic odontogenic tumors may recur and require long-term surveillance after surgery.
        The lamina dura appears as a continuous radiopaque line around tooth roots on periapical films.
        Pericoronal radiolucencies in young patients may represent dentigerous cysts or follicular tissue.
      `
      await buildAndSave(demoText, 'demo-lecture-notes.txt')
    } catch (er: unknown) {
      setErr(er instanceof Error ? er.message : 'Demo failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <h2>Upload lecture → auto-generate quiz</h2>
      <p className="muted">
        Upload your <strong>lecture PDF</strong>. The app reads the lecture text and{' '}
        <strong>creates a quiz from that content</strong>—students can review the same lecture, then
        answer questions based on it. Processing stays in the browser unless you use{' '}
        <strong>AI mode</strong> (lecture text is sent to Gemini).
      </p>

      <ol className="upload-steps card stack">
        <li>
          <strong>1. Title</strong> — name the quiz for your class.
        </li>
        <li>
          <strong>2. Choose mode</strong> — Instant (free, local) or AI (smarter questions, needs API key).
        </li>
        <li>
          <strong>3. Upload PDF</strong> — text-based PDFs work best (not scanned images).
        </li>
        <li>
          <strong>4. Students</strong> — log in as Student → <strong>Quizzes</strong> on the same device
          (or export is manual via browser storage).
        </li>
      </ol>

      <form className="card stack" onSubmit={(e) => e.preventDefault()}>
        <label className="field">
          <span>Quiz title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Week 3 — Odontogenic cysts"
          />
        </label>

        <fieldset className="field">
          <span>Generation mode</span>
          <div className="pathology-case-grid">
            <button
              type="button"
              className={mode === 'instant' ? 'pathology-case active' : 'pathology-case'}
              disabled={busy}
              onClick={() => setMode('instant')}
            >
              Instant (local)
            </button>
            <button
              type="button"
              className={mode === 'ai' ? 'pathology-case active' : 'pathology-case'}
              disabled={busy || !aiAvailable}
              onClick={() => setMode('ai')}
              title={aiAvailable ? 'Uses Gemini API' : 'Add VITE_GEMINI_API_KEY to .env'}
            >
              AI (Gemini){!aiAvailable ? ' — no key' : ''}
            </button>
          </div>
          <p className="small muted">
            {mode === 'ai'
              ? 'AI writes varied questions and distractors from your PDF text.'
              : 'Instant mode picks sentences from the PDF and builds MCQs locally (no API).'}
          </p>
        </fieldset>

        <label className="field">
          <span>Number of questions ({questionCount})</span>
          <input
            type="range"
            min={4}
            max={12}
            value={questionCount}
            disabled={busy}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
          />
        </label>

        <label className="field">
          <span>PDF file</span>
          <input type="file" accept="application/pdf" disabled={busy} onChange={onFile} />
        </label>

        <section className="card stack sample-lecture-box">
          <h3>Sample lecture in project</h3>
          <p className="small muted">
            Edit <code>public/sample-lectures/lecture-content.json</code> to choose your own
            paragraphs, run <code>npm run sample-pdf</code>, then generate a quiz from the PDF below.
          </p>
          <div className="row-actions">
            <button
              type="button"
              className="btn primary"
              disabled={busy}
              onClick={() => void useSampleLecturePdf()}
            >
              Use sample lecture PDF → generate quiz
            </button>
            <a
              className="btn secondary"
              href={publicAssetUrl(SAMPLE_LECTURE_PDF.file)}
              target="_blank"
              rel="noreferrer"
            >
              Open PDF
            </a>
          </div>
        </section>

        <div className="row-actions">
          <button type="button" className="btn secondary" disabled={busy} onClick={quickDemo}>
            Try demo (no PDF)
          </button>
        </div>
      </form>

      {busy && (
        <p className="card muted">
          {mode === 'ai' ? 'Reading PDF and generating quiz with AI…' : 'Reading PDF and building quiz…'}
        </p>
      )}
      {msg && <p className="success card">{msg}</p>}
      {err && <p className="error card">{err}</p>}

      {lastQuiz && (
        <section className="card stack">
          <h3>Preview: {lastQuiz.title}</h3>
          <p className="small muted">
            Source: {lastQuiz.sourcePdfName} · {lastQuiz.questions.length} questions
          </p>
          <ul className="quiz-preview-list">
            {lastQuiz.questions.slice(0, 3).map((q, i) => (
              <li key={q.id}>
                <strong>Q{i + 1}.</strong> {q.prompt}
                <ul>
                  {q.options.map((o) => (
                    <li key={o.id} className={o.id === q.correctOptionId ? 'quiz-preview-correct' : ''}>
                      {o.text}
                      {o.id === q.correctOptionId ? ' ✓' : ''}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          {lastQuiz.questions.length > 3 && (
            <p className="small muted">+ {lastQuiz.questions.length - 3} more questions</p>
          )}
          <div className="row-actions">
            <Link className="btn primary" to={`/app/faculty/quizzes/${lastQuiz.id}`}>
              View answer key
            </Link>
            <Link className="btn secondary" to="/app/faculty/quizzes">
              All quizzes
            </Link>
            <Link className="btn secondary" to="/app/student/quizzes">
              Preview as student
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
