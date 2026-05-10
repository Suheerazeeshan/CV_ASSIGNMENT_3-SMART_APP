import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { getPublishedFolderQuizzes } from '../../lib/loadBundledQuizzes'
import { getQuiz, getSession } from '../../lib/storage'
import type { Quiz, QuizQuestion, Session } from '../../lib/types'

const FALLBACK_ITEMS = [
  {
    q: 'Which lesion is classically associated with a non-vital tooth?',
    opts: ['Dentigerous cyst', 'Radicular cyst', 'OKC', 'Ameloblastoma'],
    ok: 1,
  },
  {
    q: 'Which tumor is most famously linked to the posterior mandible?',
    opts: ['OKC', 'Odontoma', 'Ameloblastoma', 'Fibrous dysplasia'],
    ok: 2,
  },
  {
    q: 'Which feature raises recurrence concern relative to many simple cysts?',
    opts: ['Radicular cyst lining', 'OKC behavior', 'Periapical scar', 'Mucocoele'],
    ok: 1,
  },
]

function correctOptionLabel(q: QuizQuestion): string {
  return q.options.find((o) => o.id === q.correctOptionId)?.text ?? ''
}

function BankPracticeBlock({
  quiz,
  facultySession,
}: {
  quiz: Quiz
  facultySession: Session | null
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  const score = useMemo(() => {
    let s = 0
    for (const q of quiz.questions) {
      if (answers[q.id] === q.correctOptionId) s++
    }
    return s
  }, [quiz, answers])

  function submit(e: FormEvent) {
    e.preventDefault()
    setDone(true)
  }

  return (
    <form className="stack" onSubmit={submit}>
      {quiz.questions.map((qn, idx) => (
        <fieldset key={qn.id} className="card">
          <legend>
            <strong>
              Q{idx + 1}. {qn.prompt}
            </strong>
          </legend>
          <div className="opts">
            {qn.options.map((o) => (
              <label key={o.id} className="opt">
                <input
                  type="radio"
                  name={qn.id}
                  checked={answers[qn.id] === o.id}
                  onChange={() => setAnswers((prev) => ({ ...prev, [qn.id]: o.id }))}
                  disabled={done}
                />
                {o.text}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      {!done ? (
        <button className="btn primary" type="submit">
          Check practice score
        </button>
      ) : (
        <section className="card prose">
          <p className="success">
            Practice score <strong>{score}</strong>/{quiz.questions.length}
          </p>
          <h3>Solution key (same as faculty view)</h3>
          <ol>
            {quiz.questions.map((qn, idx) => {
              const picked = answers[qn.id]
              const ok = picked === qn.correctOptionId
              return (
                <li key={qn.id}>
                  <strong>Q{idx + 1}.</strong>{' '}
                  {ok ? <span className="success">Correct</span> : <span className="error">Incorrect</span>}
                  <div className="solution-block">
                    <span className="muted">Correct answer: </span>
                    <strong>{correctOptionLabel(qn)}</strong>
                  </div>
                </li>
              )
            })}
          </ol>
          {facultySession?.role === 'faculty' && (
            <p className="muted small">
              <Link to={`/app/faculty/quizzes/${quiz.id}`}>Open full faculty solution layout</Link> (same
              answer key).
            </p>
          )}
        </section>
      )}
    </form>
  )
}

export function SampleQuiz() {
  const bank = useMemo(() => getPublishedFolderQuizzes(), [])
  const [quizId, setQuizId] = useState(() => bank[0]?.id ?? '')
  const quiz = quizId ? getQuiz(quizId) : undefined

  const [pick, setPick] = useState<number[]>(() => FALLBACK_ITEMS.map(() => -1))
  const [fallbackDone, setFallbackDone] = useState(false)

  const facultySession = getSession()

  const fbScore = useMemo(() => {
    let s = 0
    FALLBACK_ITEMS.forEach((it, i) => {
      if (pick[i] === it.ok) s++
    })
    return s
  }, [pick])

  const useBank = bank.length > 0 && quiz

  if (useBank) {
    return (
      <div className="page">
        <h2>Sample quiz (practice)</h2>
        <p className="muted">
          Uses the <strong>faculty quiz bank</strong> from <code>public/quizzes/</code>. Not sent to faculty
          reports. Same questions and official answers as{' '}
          <Link to="/app/faculty/quizzes">Faculty → Quizzes → Solutions</Link>.
        </p>

        <div className="card stack">
          <label className="field">
            <span>Practice set</span>
            <select value={quizId} onChange={(e) => setQuizId(e.target.value)}>
              {bank.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <BankPracticeBlock key={quizId} quiz={quiz} facultySession={facultySession} />
      </div>
    )
  }

  return (
    <div className="page">
      <h2>Sample quiz (practice)</h2>
      <p className="muted">
        Faculty JSON bank not loaded (offline or missing <code>public/quizzes/</code>). Using a tiny built-in
        drill instead.
      </p>
      <form
        className="stack"
        onSubmit={(e) => {
          e.preventDefault()
          setFallbackDone(true)
        }}
      >
        {FALLBACK_ITEMS.map((it, idx) => (
          <fieldset key={idx} className="card">
            <legend>
              <strong>
                Q{idx + 1}. {it.q}
              </strong>
            </legend>
            <div className="opts">
              {it.opts.map((o, j) => (
                <label key={j} className="opt">
                  <input
                    type="radio"
                    name={`q-${idx}`}
                    checked={pick[idx] === j}
                    onChange={() =>
                      setPick((prev) => {
                        const n = [...prev]
                        n[idx] = j
                        return n
                      })
                    }
                  />
                  {o}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        {!fallbackDone ? (
          <button className="btn primary" type="submit">
            Check practice score
          </button>
        ) : (
          <p className="success">
            Practice score {fbScore}/{FALLBACK_ITEMS.length}. Key: B, C, B (radicular cyst, ameloblastoma,
            OKC).
          </p>
        )}
      </form>
    </div>
  )
}
