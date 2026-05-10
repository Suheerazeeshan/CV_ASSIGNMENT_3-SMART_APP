const guideTopics = [
  'Login (role, display name, password)',
  'Faculty PDF upload & quiz builder',
  'Student quiz attempt',
  'Faculty performance report',
  'AR preparation overlay',
  'Chatbot study assistant',
  '3D model viewer',
  'Computer vision lab',
]

export function Guide() {
  return (
    <div className="page">
      <h2>End-user guide</h2>
      <p className="lead">
        Quick map of main screens in this prototype. Each topic below matches a primary workflow area—no
        screenshot files required.
      </p>

      <section className="card prose">
        <h3>Faculty workflow</h3>
        <ol>
          <li>Sign in as Faculty and open Upload PDF.</li>
          <li>Select a text-based PDF (lecture notes work best). The app extracts text locally.</li>
          <li>Generated MCQs are saved automatically for all students on this device.</li>
          <li>Open Quizzes → Solutions to review correct answers.</li>
          <li>Open Reports to see each student attempt, score, and timestamp.</li>
          <li>Use Bookmarks / Notes to save preparation links and rubrics.</li>
        </ol>
      </section>

      <section className="card prose">
        <h3>Student workflow</h3>
        <ol>
          <li>
            Use Reading, <strong>Sample lectures</strong> (built-in modules), Prompting, Bookmarks,
            and Notes to prepare.
          </li>
          <li>Explore 3D models and the CV lab for visualization / classical image analysis.</li>
          <li>Try Sample quiz, Image lab, AR prep, then Take quiz.</li>
          <li>My results lists graded attempts stored on this device.</li>
        </ol>
      </section>

      <section className="card prose">
        <h3>Chatbot & AI vision</h3>
        <p>
          Text chat can use <code>VITE_GEMINI_API_KEY</code>. The CV lab adds optional{' '}
          <strong>Gemini vision</strong> commentary on uploaded teaching images.
        </p>
      </section>

      <h3 className="guide-topics-heading">Guide topics</h3>
      <div className="guide-topic-grid">
        {guideTopics.map((title) => (
          <div key={title} className="guide-topic-card">
            {title}
          </div>
        ))}
      </div>
    </div>
  )
}
