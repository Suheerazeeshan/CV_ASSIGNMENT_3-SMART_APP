import { Link } from 'react-router-dom'

export function Reading() {
  return (
    <div className="page">
      <h2>Reading module</h2>
      <p className="muted">
        For longer structured modules, open{' '}
        <Link to="/app/student/lectures">Sample lectures</Link>.
      </p>
      <article className="card prose">
        <h3>Odontogenic cysts</h3>
        <p>
          Odontogenic cysts originate from epithelium associated with tooth development. Inflammatory
          cysts such as radicular cysts form at the apex of compromised teeth, whereas developmental
          cysts like dentigerous cysts envelop crowns of unerupted teeth.
        </p>
        <h3>Odontogenic tumors</h3>
        <p>
          Ameloblastoma is a clinically significant benign epithelial odontogenic tumor that favors
          the posterior mandible and typically requires surgical management informed by imaging.
          Keratocystic lesions demonstrate aggressive behavior and recurrence potential compared with
          many other cystic lesions.
        </p>
        <h3>Study prompts while reading</h3>
        <ul>
          <li>Sketch the tooth-bearing regions where each lesion commonly appears.</li>
          <li>Contrast inflammatory versus developmental cyst pathways.</li>
          <li>Note radiographic patterns mentioned in your lecture PDFs.</li>
        </ul>
      </article>
    </div>
  )
}
