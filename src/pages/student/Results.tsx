import { Link } from 'react-router-dom'
import { attemptsForStudent, getQuizzes, getSession } from '../../lib/storage'

export function Results() {
  const session = getSession()
  const quizzes = getQuizzes()
  const titleById = new Map(quizzes.map((q) => [q.id, q.title]))
  const titleOf = (id: string) => titleById.get(id) ?? id

  const mine =
    session?.role === 'student'
      ? attemptsForStudent(session.name).sort(
          (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
        )
      : []

  return (
    <div className="page">
      <h2>My quiz results</h2>
      {mine.length === 0 ? (
        <p className="card">
          No attempts yet.{' '}
          <Link to="/app/student/quizzes">Take a quiz</Link>.
        </p>
      ) : (
        <ul className="list card">
          {mine.map((r) => (
            <li key={r.id}>
              <strong>{titleOf(r.quizId)}</strong>
              <span className="muted small">
                {' '}
                · {new Date(r.completedAt).toLocaleString()} · {r.score}/{r.total} (
                {Math.round((r.score / r.total) * 100)}%)
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
