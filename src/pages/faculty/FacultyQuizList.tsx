import { Link } from 'react-router-dom'
import { isPublishedFolderQuiz } from '../../lib/loadBundledQuizzes'
import { getQuizzes } from '../../lib/storage'

export function FacultyQuizList() {
  const quizzes = getQuizzes().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <div className="page">
      <h2>Quizzes & solutions</h2>
      <p className="muted">
        Open a quiz to view the full solution key. Quizzes from <code>public/quizzes/</code> appear here
        automatically after load.
      </p>
      {quizzes.length === 0 ? (
        <p className="card">
          No quizzes yet. Upload a PDF from the faculty menu, or add JSON files under{' '}
          <code>public/quizzes/</code> (see index.json).
        </p>
      ) : (
        <ul className="list card">
          {quizzes.map((q) => (
            <li key={q.id}>
              <Link to={`/app/faculty/quizzes/${q.id}`}>
                <strong>{q.title}</strong>
                <span className="muted small">
                  {' '}
                  · {q.questions.length} items ·{' '}
                  {isPublishedFolderQuiz(q)
                    ? 'Faculty bank (JSON folder)'
                    : q.sourcePdfName ?? 'PDF-generated'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
