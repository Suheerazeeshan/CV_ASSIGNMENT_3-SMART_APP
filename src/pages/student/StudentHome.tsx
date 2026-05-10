import { Link } from 'react-router-dom'

export function StudentHome() {
  return (
    <div className="page">
      <h2>Student hub</h2>
      <p className="lead">
        Mirrors the learner side of the LMS use-case flow: view chapters and topics, take practice or
        graded tests, check results, and track progress—plus labs that stay entirely on this device.
      </p>
      <div className="grid-cards">
        <Link className="card tile" to="/app/student/read">
          <h3>Reading</h3>
          <p className="muted">Curated odontogenic pathology notes.</p>
        </Link>
        <Link className="card tile" to="/app/student/lectures">
          <h3>Sample lectures</h3>
          <p className="muted">Full in-app lecture modules (no PDF needed).</p>
        </Link>
        <Link className="card tile" to="/app/student/prompts">
          <h3>Prompting toolkit</h3>
          <p className="muted">Templates for AI-assisted study sessions.</p>
        </Link>
        <Link className="card tile" to="/app/student/sample-quiz">
          <h3>Sample quiz</h3>
          <p className="muted">Low-stakes practice.</p>
        </Link>
        <Link className="card tile" to="/app/student/ar">
          <h3>AR preparation</h3>
          <p className="muted">Camera overlay lab.</p>
        </Link>
        <Link className="card tile" to="/app/student/image-lab">
          <h3>Image lab</h3>
          <p className="muted">Visual identification drill.</p>
        </Link>
        <Link className="card tile" to="/app/student/models">
          <h3>3D models</h3>
          <p className="muted">Interactive GLB anatomy viewer.</p>
        </Link>
        <Link className="card tile" to="/app/student/cv-lab">
          <h3>CV lab</h3>
          <p className="muted">Classical pipeline + optional Gemini vision.</p>
        </Link>
        <Link className="card tile" to="/app/bookmarks">
          <h3>Bookmarks</h3>
          <p className="muted">Shortcut important screens.</p>
        </Link>
        <Link className="card tile" to="/app/notes">
          <h3>Notes</h3>
          <p className="muted">Personal study notebook.</p>
        </Link>
        <Link className="card tile" to="/app/student/quizzes">
          <h3>Take quiz</h3>
          <p className="muted">Graded attempts visible to faculty reports.</p>
        </Link>
        <Link className="card tile" to="/app/student/results">
          <h3>My results</h3>
          <p className="muted">Review past scores.</p>
        </Link>
      </div>
    </div>
  )
}
