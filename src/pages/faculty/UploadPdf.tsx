import { useState } from 'react'
import { extractTextFromPdfBuffer } from '../../lib/pdfExtract'
import { generateQuizFromText } from '../../lib/quizGen'
import { saveQuiz } from '../../lib/storage'

export function UploadPdf() {
  const [title, setTitle] = useState('New quiz from PDF')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setErr(null)
    setMsg(null)
    setBusy(true)
    try {
      const buf = await file.arrayBuffer()
      const text = await extractTextFromPdfBuffer(buf)
      const quiz = generateQuizFromText(text, title.trim() || file.name, file.name)
      saveQuiz(quiz)
      setMsg(`Saved “${quiz.title}” with ${quiz.questions.length} questions.`)
    } catch (er: unknown) {
      setErr(er instanceof Error ? er.message : 'Failed to process PDF')
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  function quickDemo() {
    const demoText = `
      Odontogenic cysts are epithelial-lined cavities derived from tooth-forming tissues.
      Radicular cysts develop at the apex of a non-vital tooth and are inflammatory in origin.
      Dentigerous cysts surround the crown of an unerupted tooth and are developmental.
      Ameloblastoma is a locally invasive odontogenic tumor commonly affecting the mandible.
      Keratocystic odontogenic tumors may recur and require long-term surveillance after surgery.
    `
    const quiz = generateQuizFromText(demoText, title.trim() || 'Demo odontogenic quiz', 'demo-notes.txt')
    saveQuiz(quiz)
    setMsg(`Saved demo quiz “${quiz.title}” with ${quiz.questions.length} questions (no PDF needed).`)
  }

  return (
    <div className="page">
      <h2>Upload PDF → quiz</h2>
      <p className="muted">
        Parsing runs entirely in your browser. Scanned PDFs without text layers may fail—use
        text-based lecture exports when possible.
      </p>
      <form className="card stack" onSubmit={(e) => e.preventDefault()}>
        <label className="field">
          <span>Quiz title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className="field">
          <span>PDF file</span>
          <input type="file" accept="application/pdf" disabled={busy} onChange={onFile} />
        </label>
        <button type="button" className="btn secondary" disabled={busy} onClick={quickDemo}>
          Generate demo quiz (no PDF)
        </button>
      </form>
      {busy && <p className="muted">Processing…</p>}
      {msg && <p className="success">{msg}</p>}
      {err && <p className="error">{err}</p>}
    </div>
  )
}
