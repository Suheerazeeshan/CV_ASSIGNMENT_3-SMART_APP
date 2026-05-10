import { Link, useParams } from 'react-router-dom'
import { getSampleLecture } from '../../data/sampleLectures'

export function SampleLectureDetail() {
  const { lectureId } = useParams()
  const lecture = lectureId ? getSampleLecture(lectureId) : undefined

  if (!lecture) {
    return (
      <div className="page">
        <p>Lecture not found.</p>
        <Link to="/app/student/lectures">← All sample lectures</Link>
      </div>
    )
  }

  return (
    <div className="page lecture-detail">
      <p className="back-link">
        <Link to="/app/student/lectures">← Sample lectures</Link>
      </p>
      <header className="lecture-header card">
        <h2>{lecture.title}</h2>
        <p className="muted">{lecture.summary}</p>
        <p className="lecture-meta">Estimated reading time: {lecture.estimatedMinutes} minutes</p>
      </header>
      {lecture.sections.map((sec) => (
        <article key={sec.heading} className="card prose lecture-section">
          <h3>{sec.heading}</h3>
          {sec.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>
      ))}
    </div>
  )
}
