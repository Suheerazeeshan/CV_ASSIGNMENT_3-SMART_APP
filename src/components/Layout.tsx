import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BookmarkPageButton } from './BookmarkPageButton'
import { setSession, getSession } from '../lib/storage'

function sidebarLinkClass(isActive: boolean) {
  return 'sidebar-link' + (isActive ? ' sidebar-link-active' : '')
}

export function Layout() {
  const nav = useNavigate()
  const session = getSession()
  const workspace =
    session?.role === 'faculty' ? 'Faculty workspace' : 'Student workspace'

  function logout() {
    setSession(null)
    nav('/', { replace: true })
  }

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar" aria-label="Course navigation">
        <div className="sidebar-brand">
          <div className="sidebar-brand-inner">
            <div className="sidebar-logo" aria-hidden>
              🦷
            </div>
            <strong className="sidebar-title">Odontogenic Oral Pathology</strong>
            <p className="sidebar-role-line muted small">{workspace}</p>
            <div className="sidebar-user-box" aria-label="Signed in as">
              {session?.name}
            </div>
          </div>
        </div>

        <div className="sidebar-scroll">
          <nav className="sidebar-quick" aria-label="Tools">
            <NavLink to="/app/guide" className={({ isActive }) => sidebarLinkClass(isActive)}>
              User guide
            </NavLink>
            <NavLink to="/app/chat" className={({ isActive }) => sidebarLinkClass(isActive)}>
              Chatbot
            </NavLink>
            <NavLink to="/app/bookmarks" className={({ isActive }) => sidebarLinkClass(isActive)}>
              Bookmarks
            </NavLink>
            <NavLink to="/app/notes" className={({ isActive }) => sidebarLinkClass(isActive)}>
              Notes
            </NavLink>
            <div className="sidebar-bookmark-wrap">
              <BookmarkPageButton />
            </div>
          </nav>

          <nav className="sidebar-sections" aria-label="Course areas">
            {session?.role === 'faculty' ? (
              <>
                <div className="nav-section-label">Curriculum &amp; tests</div>
                <NavLink to="/app/faculty" end className={({ isActive }) => sidebarLinkClass(isActive)}>
                  Faculty home
                </NavLink>
                <NavLink
                  to="/app/faculty/upload"
                  className={({ isActive }) => sidebarLinkClass(isActive)}
                  title="PDF → MCQs"
                >
                  Upload PDF
                </NavLink>
                <NavLink
                  to="/app/faculty/quizzes"
                  className={({ isActive }) => sidebarLinkClass(isActive)}
                >
                  Manage quizzes / tests
                </NavLink>
                <NavLink
                  to="/app/faculty/reports"
                  className={({ isActive }) => sidebarLinkClass(isActive)}
                >
                  View student progress
                </NavLink>
              </>
            ) : (
              <>
                <div className="nav-section-label">Chapters &amp; topics</div>
                <NavLink to="/app/student" end className={({ isActive }) => sidebarLinkClass(isActive)}>
                  Student home
                </NavLink>
                <NavLink to="/app/student/read" className={({ isActive }) => sidebarLinkClass(isActive)}>
                  Reading (chapters)
                </NavLink>
                <NavLink
                  to="/app/student/lectures"
                  className={({ isActive }) => sidebarLinkClass(isActive)}
                >
                  Topics / lectures
                </NavLink>

                <div className="nav-section-label">Tests &amp; results</div>
                <NavLink
                  to="/app/student/sample-quiz"
                  className={({ isActive }) => sidebarLinkClass(isActive)}
                >
                  Practice (pre-test)
                </NavLink>
                <NavLink
                  to="/app/student/quizzes"
                  className={({ isActive }) => sidebarLinkClass(isActive)}
                >
                  Submit quiz attempt
                </NavLink>
                <NavLink
                  to="/app/student/results"
                  className={({ isActive }) => sidebarLinkClass(isActive)}
                >
                  Post-test results
                </NavLink>

                <div className="nav-section-label">Labs &amp; prep</div>
                <NavLink
                  to="/app/student/prompts"
                  className={({ isActive }) => sidebarLinkClass(isActive)}
                >
                  Prompting
                </NavLink>
                <NavLink to="/app/student/ar" className={({ isActive }) => sidebarLinkClass(isActive)}>
                  AR prep
                </NavLink>
                <NavLink
                  to="/app/student/image-lab"
                  className={({ isActive }) => sidebarLinkClass(isActive)}
                >
                  Image lab
                </NavLink>
                <NavLink
                  to="/app/student/models"
                  className={({ isActive }) => sidebarLinkClass(isActive)}
                >
                  3D models
                </NavLink>
                <NavLink
                  to="/app/student/cv-lab"
                  className={({ isActive }) => sidebarLinkClass(isActive)}
                >
                  CV lab
                </NavLink>
              </>
            )}
          </nav>
        </div>

        <div className="sidebar-footer">
          <button type="button" className="btn ghost sidebar-logout" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <main className="main dashboard-main-inner">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
