import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBookmarks, removeBookmark } from '../lib/bookmarksNotes'

export function Bookmarks() {
  const [tick, setTick] = useState(0)
  const list = useMemo(() => {
    void tick
    return getBookmarks().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }, [tick])

  return (
    <div className="page">
      <h2>Bookmarks</h2>
      <p className="muted">
        Saved shortcuts to modules you revisit often (stored in this browser). Use “Bookmark page”
        in the sidebar while viewing any screen.
      </p>
      {list.length === 0 ? (
        <p className="card">No bookmarks yet.</p>
      ) : (
        <ul className="list card">
          {list.map((b) => (
            <li key={b.id}>
              <Link to={b.href}>
                <strong>{b.label}</strong>
              </Link>
              <span className="muted small"> · {b.href}</span>
              <button
                type="button"
                className="btn ghost small-inline"
                onClick={() => {
                  removeBookmark(b.id)
                  setTick((x) => x + 1)
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
