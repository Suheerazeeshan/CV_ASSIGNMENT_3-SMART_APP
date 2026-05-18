import { useState, type FormEvent } from 'react'
import { chatbotReply } from '../lib/chatbot'
import { hasAiQuizGeneration } from '../lib/quizGenAi'

type Msg = { role: 'user' | 'bot'; text: string }

const STARTER_PROMPTS = [
  'How does this app work?',
  'How are quizzes generated from a lecture PDF?',
  'How do faculty see student progress reports?',
  'What is a dentigerous cyst?',
]

export function Chat() {
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: 'bot',
      text:
        'Ask about this app (quizzes, faculty upload, reports) or odontogenic pathology topics. ' +
        (hasAiQuizGeneration()
          ? 'Gemini is enabled for deeper answers when built-in help does not match.'
          : 'Built-in answers work offline. Add VITE_GEMINI_API_KEY for optional Gemini answers.'),
    },
  ])
  const [busy, setBusy] = useState(false)

  async function sendText(text: string) {
    const t = text.trim()
    if (!t || busy) return
    setInput('')
    setMsgs((m) => [...m, { role: 'user', text: t }])
    setBusy(true)
    const reply = await chatbotReply(t)
    setMsgs((m) => [...m, { role: 'bot', text: reply }])
    setBusy(false)
  }

  function send(e: FormEvent) {
    e.preventDefault()
    void sendText(input)
  }

  return (
    <div className="page chat-page">
      <h2>Study chatbot</h2>
      <p className="muted">
        Client-side assistant. Built-in answers explain <strong>this app</strong> (menus, quizzes,
        reports). Gemini adds pathology depth when an API key is set.
      </p>

      <section className="card stack">
        <h3 className="section-heading">Example questions</h3>
        <div className="pathology-case-grid">
          {STARTER_PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              className="pathology-case"
              disabled={busy}
              onClick={() => void sendText(p)}
            >
              {p}
            </button>
          ))}
        </div>
        <p className="small muted">
          <strong>App help:</strong> how it works, PDF → quiz, faculty reports, student quizzes, AR/3D
          labs. <strong>Subject help:</strong> cysts, tumors, imaging cues.
        </p>
      </section>

      <div className="chat-log card">
        {msgs.map((m, i) => (
          <div key={i} className={'bubble ' + m.role}>
            {m.text}
          </div>
        ))}
        {busy && <div className="bubble bot">Thinking…</div>}
      </div>
      <form onSubmit={send} className="chat-input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a question…"
          disabled={busy}
        />
        <button type="submit" className="btn primary" disabled={busy}>
          Send
        </button>
      </form>
    </div>
  )
}
