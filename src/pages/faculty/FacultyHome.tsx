import { Link } from 'react-router-dom'

export function FacultyHome() {
  return (
    <div className="page">
      <h2>Faculty dashboard</h2>
      <p className="lead">
        Aligns with faculty responsibilities in the course model: ingest teaching materials (PDF →
        items), create and manage tests, view reports on student attempts—all locally for this
        prototype (Firebase-style persistence would replace localStorage in production).
      </p>
      <div className="grid-cards">
        <Link className="card tile" to="/app/faculty/upload">
          <h3>Upload PDF</h3>
          <p className="muted">Extract text locally and auto-build MCQs.</p>
        </Link>
        <Link className="card tile" to="/app/faculty/quizzes">
          <h3>Quizzes & solutions</h3>
          <p className="muted">View items and official answer key.</p>
        </Link>
        <Link className="card tile" to="/app/faculty/reports">
          <h3>Performance reports</h3>
          <p className="muted">Scores and attempts per quiz.</p>
        </Link>
        <Link className="card tile" to="/app/chat">
          <h3>Chatbot</h3>
          <p className="muted">Explain app workflows to learners.</p>
        </Link>
        <Link className="card tile" to="/app/student">
          <h3>Preview student hub</h3>
          <p className="muted">See quizzes and prep tools as learners do.</p>
        </Link>
        <Link className="card tile" to="/app/student/lectures">
          <h3>Sample lectures</h3>
          <p className="muted">Review built-in lecture content students can read.</p>
        </Link>
        <Link className="card tile" to="/app/bookmarks">
          <h3>Bookmarks</h3>
          <p className="muted">Pin syllabus PDF routes or quiz keys.</p>
        </Link>
        <Link className="card tile" to="/app/notes">
          <h3>Notes</h3>
          <p className="muted">Faculty scratchpad for cohort reminders.</p>
        </Link>
      </div>
    </div>
  )
}
