import { useMemo, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { getQuiz, getSession, saveAttempt } from '../../lib/storage'

export function QuizTake() {
  const { id } = useParams()
  const quiz = id ? getQuiz(id) : undefined
  const session = getSession()

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const score = useMemo(() => {
    if (!quiz) return 0
    let s = 0
    for (const q of quiz.questions) {
      if (answers[q.id] === q.correctOptionId) s++
    }
    return s
  }, [quiz, answers])

  function toggle(qid: string, oid: string) {
    setAnswers((prev) => ({ ...prev, [qid]: oid }))
  }

  function finish(e: FormEvent) {
    e.preventDefault()
    if (!quiz || !session || session.role !== 'student') return
    saveAttempt({
      id: uuidv4(),
      quizId: quiz.id,
      studentName: session.name,
      score,
      total: quiz.questions.length,
      answers,
      completedAt: new Date().toISOString(),
    })
    setSubmitted(true)
  }

  if (!quiz) {
    return (
      <div className="page">
        <p>Quiz missing.</p>
        <Link to="/app/student/quizzes">Back</Link>
      </div>
    )
  }

  return (
    <div className="page">
      <p>
        <Link to="/app/student/quizzes">← Quizzes</Link>
      </p>
      <h2>{quiz.title}</h2>
      <p className="muted">Graded attempt saves to faculty reports on this browser.</p>
      <form className="stack" onSubmit={finish}>
        {quiz.questions.map((qn, idx) => (
          <fieldset key={qn.id} className="card" disabled={submitted}>
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
                    onChange={() => toggle(qn.id, o.id)}
                  />
                  {o.text}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        {!submitted ? (
          <button className="btn primary" type="submit">
            Submit attempt
          </button>
        ) : (
          <p className="success">
            Saved score {score}/{quiz.questions.length}. Review answers with faculty solutions if
            needed.
          </p>
        )}
      </form>
    </div>
  )
}
