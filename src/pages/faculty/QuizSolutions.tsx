import { Link, useParams } from 'react-router-dom'
import { getQuiz } from '../../lib/storage'

export function QuizSolutions() {
  const { id } = useParams()
  const quiz = id ? getQuiz(id) : undefined

  if (!quiz) {
    return (
      <div className="page">
        <p>Quiz not found.</p>
        <Link to="/app/faculty/quizzes">Back</Link>
      </div>
    )
  }

  return (
    <div className="page">
      <p>
        <Link to="/app/faculty/quizzes">← All quizzes</Link>
      </p>
      <h2>{quiz.title}</h2>
      <p className="muted">Official solutions (faculty only on this device).</p>
      <ol className="stack">
        {quiz.questions.map((qn, idx) => (
          <li key={qn.id} className="card prose">
            <p>
              <strong>
                Q{idx + 1}. {qn.prompt}
              </strong>
            </p>
            <ul>
              {qn.options.map((o) => (
                <li key={o.id} className={o.id === qn.correctOptionId ? 'correct-opt' : ''}>
                  {o.text}
                  {o.id === qn.correctOptionId ? ' ✓' : ''}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  )
}
