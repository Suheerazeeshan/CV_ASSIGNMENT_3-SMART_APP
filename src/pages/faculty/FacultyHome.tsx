import { FeatureTile } from '../../components/FeatureTile'

export function FacultyHome() {
  return (
    <div className="page page-home">
      <header className="page-hero page-hero--faculty">
        <div className="page-hero-content">
          <span className="hero-badge">Faculty workspace</span>
          <h2>Faculty dashboard</h2>
          <p className="lead">
            Upload teaching materials, auto-build quizzes, review solutions, and track student
            performance—all from one dashboard.
          </p>
        </div>
      </header>

      <h3 className="section-heading">Curriculum & assessment</h3>
      <div className="grid-cards">
        <FeatureTile
          to="/app/faculty/upload"
          icon="📄"
          title="PDF → Quiz generator"
          description="Upload a lecture PDF; instant or AI multiple-choice quiz."
          accent="indigo"
        />
        <FeatureTile
          to="/app/faculty/quizzes"
          icon="📋"
          title="Quizzes & solutions"
          description="View items and official answer key."
          accent="teal"
        />
        <FeatureTile
          to="/app/faculty/reports"
          icon="📈"
          title="Performance reports"
          description="Scores and attempts per quiz."
          accent="amber"
        />
      </div>

      <h3 className="section-heading">Tools & preview</h3>
      <div className="grid-cards">
        <FeatureTile
          to="/app/chat"
          icon="💬"
          title="Chatbot"
          description="Explain app workflows to learners."
          accent="violet"
        />
        <FeatureTile
          to="/app/student"
          icon="👀"
          title="Preview student hub"
          description="See quizzes and prep tools as learners do."
          accent="sky"
        />
        <FeatureTile
          to="/app/student/lectures"
          icon="🎓"
          title="Sample lectures"
          description="Review built-in lecture content students can read."
          accent="indigo"
        />
        <FeatureTile
          to="/app/bookmarks"
          icon="🔖"
          title="Bookmarks"
          description="Pin syllabus PDF routes or quiz keys."
          accent="rose"
        />
        <FeatureTile
          to="/app/notes"
          icon="📓"
          title="Notes"
          description="Faculty scratchpad for cohort reminders."
          accent="emerald"
        />
      </div>
    </div>
  )
}
