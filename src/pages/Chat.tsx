import { useState, type FormEvent } from 'react'
import { geminiAnswer, localBotAnswer } from '../lib/chatbot'

type Msg = { role: 'user' | 'bot'; text: string }

export function Chat() {
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: 'bot',
      text:
        'Ask about odontogenic cysts and tumors, quiz steps, or faculty PDF uploads. ' +
        'Add VITE_GEMINI_API_KEY for optional AI Studio answers.',
    },
  ])
  const [busy, setBusy] = useState(false)

  async function send(e: FormEvent) {
    e.preventDefault()
    const t = input.trim()
    if (!t || busy) return
    setInput('')
    setMsgs((m) => [...m, { role: 'user', text: t }])
    setBusy(true)
    let reply = localBotAnswer(t)
    try {
      const g = await geminiAnswer(t)
      if (g) reply = g
    } catch {
      /* keep local */
    }
    setMsgs((m) => [...m, { role: 'bot', text: reply }])
    setBusy(false)
  }

  return (
    <div className="page chat-page">
      <h2>Study chatbot</h2>
      <p className="muted">Client-side assistant with optional Gemini enhancement.</p>
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
        />
        <button type="submit" className="btn primary" disabled={busy}>
          Send
        </button>
      </form>
    </div>
  )
}
