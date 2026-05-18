import { FeatureTile } from '../../components/FeatureTile'

export function StudentHome() {
  return (
    <div className="page page-home">
      <header className="page-hero page-hero--student">
        <div className="page-hero-content">
          <span className="hero-badge">Student workspace</span>
          <h2>Student hub</h2>
          <p className="lead">
            Chapters, topics, practice tests, graded quizzes, and interactive labs—everything you
            need to master odontogenic oral pathology.
          </p>
        </div>
      </header>

      <h3 className="section-heading">Learn & explore</h3>
      <div className="grid-cards">
        <FeatureTile
          to="/app/student/read"
          icon="📖"
          title="Reading"
          description="Curated odontogenic pathology notes."
          accent="teal"
        />
        <FeatureTile
          to="/app/student/lectures"
          icon="🎓"
          title="Sample lectures"
          description="Full in-app lecture modules (no PDF needed)."
          accent="indigo"
        />
        <FeatureTile
          to="/app/student/prompts"
          icon="✨"
          title="Prompting toolkit"
          description="Templates for AI-assisted study sessions."
          accent="violet"
        />
        <FeatureTile
          to="/app/student/sample-quiz"
          icon="📝"
          title="Sample quiz"
          description="Low-stakes practice before graded tests."
          accent="amber"
        />
      </div>

      <h3 className="section-heading">Interactive labs</h3>
      <div className="grid-cards">
        <FeatureTile
          to="/app/student/ar"
          icon="📷"
          title="AR preparation"
          description="Camera overlay lab for spatial study."
          accent="rose"
        />
        <FeatureTile
          to="/app/student/image-lab"
          icon="🔬"
          title="Image lab"
          description="Visual identification drill."
          accent="sky"
        />
        <FeatureTile
          to="/app/student/models"
          icon="🧊"
          title="3D models"
          description="Interactive GLB anatomy viewer."
          accent="indigo"
        />
        <FeatureTile
          to="/app/student/cv-lab"
          icon="🖼️"
          title="CV lab"
          description="Classical pipeline + optional Gemini vision."
          accent="emerald"
        />
      </div>

      <h3 className="section-heading">Tests & tools</h3>
      <div className="grid-cards">
        <FeatureTile
          to="/app/student/quizzes"
          icon="✅"
          title="Take quiz"
          description="Graded attempts visible to faculty reports."
          accent="teal"
        />
        <FeatureTile
          to="/app/student/results"
          icon="📊"
          title="My results"
          description="Review past scores and progress."
          accent="amber"
        />
        <FeatureTile
          to="/app/bookmarks"
          icon="🔖"
          title="Bookmarks"
          description="Shortcut important screens."
          accent="sky"
        />
        <FeatureTile
          to="/app/notes"
          icon="📓"
          title="Notes"
          description="Personal study notebook."
          accent="violet"
        />
      </div>
    </div>
  )
}
