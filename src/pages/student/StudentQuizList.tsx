import { Link } from 'react-router-dom'
import { getQuizzes } from '../../lib/storage'

export function StudentQuizList() {
  const quizzes = getQuizzes().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <div className="page">
      <h2>Available quizzes</h2>
      <p className="muted">Published automatically when faculty generates them on this device.</p>
      {quizzes.length === 0 ? (
        <p className="card">No quizzes yet—ask faculty to upload a PDF or run the demo generator.</p>
      ) : (
        <ul className="list card">
          {quizzes.map((q) => (
            <li key={q.id}>
              <Link to={`/app/student/quiz/${q.id}`}>
                <strong>{q.title}</strong>
                <span className="muted small"> · {q.questions.length} questions</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
