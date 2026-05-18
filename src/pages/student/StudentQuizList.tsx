import { Link } from 'react-router-dom'
import { isPublishedFolderQuiz } from '../../lib/loadBundledQuizzes'
import { getQuizzes } from '../../lib/storage'

export function StudentQuizList() {
  const quizzes = getQuizzes().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const fromLecture = quizzes.filter((q) => q.lectureText && !isPublishedFolderQuiz(q))
  const other = quizzes.filter((q) => !q.lectureText || isPublishedFolderQuiz(q))

  return (
    <div className="page">
      <h2>Quizzes from lectures</h2>
      <p className="muted">
        When faculty uploads a lecture PDF, a matching quiz is generated from that lecture. Read the
        material, then take the quiz.
      </p>

      {fromLecture.length > 0 && (
        <section className="stack">
          <h3 className="section-heading">From faculty lectures</h3>
          <ul className="quiz-lecture-list">
            {fromLecture.map((q) => (
              <li key={q.id} className="card quiz-lecture-card">
                <div className="quiz-lecture-card-head">
                  <span className="quiz-lecture-badge">Lecture quiz</span>
                  {q.sourcePdfName && (
                    <span className="small muted">Source: {q.sourcePdfName}</span>
                  )}
                </div>
                <h4>{q.title}</h4>
                <p className="small muted">{q.questions.length} questions from this lecture</p>
                <div className="row-actions">
                  <Link className="btn primary" to={`/app/student/quiz/${q.id}`}>
                    Take quiz
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {other.length > 0 && (
        <section className="stack">
          <h3 className="section-heading">
            {fromLecture.length > 0 ? 'Other practice quizzes' : 'Available quizzes'}
          </h3>
          <ul className="list card">
            {other.map((q) => (
              <li key={q.id}>
                <Link to={`/app/student/quiz/${q.id}`}>
                  <strong>{q.title}</strong>
                  <span className="muted small"> · {q.questions.length} questions</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {quizzes.length === 0 && (
        <p className="card">
          No quizzes yet. Ask faculty to upload a lecture PDF under{' '}
          <strong>Faculty → PDF → Quiz generator</strong>.
        </p>
      )}
    </div>
  )
}
