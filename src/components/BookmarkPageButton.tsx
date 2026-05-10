import { useLocation } from 'react-router-dom'
import { addBookmark } from '../lib/bookmarksNotes'

export function BookmarkPageButton() {
  const loc = useLocation()

  function onBookmark() {
    const href = `${loc.pathname}${loc.search}`
    const suggestion = href.replace(/^\/app\//, '').replace(/\//g, ' · ') || 'Page'
    const label = window.prompt('Bookmark label', suggestion)
    if (label === null) return
    addBookmark(label.trim() || suggestion, href)
    window.alert('Saved under Bookmarks.')
  }

  return (
    <button type="button" className="btn ghost" onClick={onBookmark}>
      Bookmark page
    </button>
  )
}
