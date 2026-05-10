import { Link } from 'react-router-dom'
import { SAMPLE_LECTURES } from '../../data/sampleLectures'

export function SampleLectures() {
  return (
    <div className="page">
      <h2>Sample lectures</h2>
      <p className="lead muted">
        Built-in teaching notes for odontogenic oral pathology—read here without uploading a PDF.
      </p>
      <ul className="lecture-card-grid">
        {SAMPLE_LECTURES.map((lec) => (
          <li key={lec.id}>
            <Link className="card tile lecture-card" to={`/app/student/lectures/${lec.id}`}>
              <h3>{lec.title}</h3>
              <p className="muted small">{lec.summary}</p>
              <p className="lecture-meta">About {lec.estimatedMinutes} min read</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
