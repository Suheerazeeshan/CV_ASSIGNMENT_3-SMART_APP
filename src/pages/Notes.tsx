import { useMemo, useState, type FormEvent } from 'react'
import {
  createNote,
  deleteNote,
  getNotes,
  type NoteEntry,
  upsertNote,
} from '../lib/bookmarksNotes'

function NoteEditor({
  note,
  onSaved,
  onDeleted,
}: {
  note: NoteEntry
  onSaved: () => void
  onDeleted: () => void
}) {
  const [title, setTitle] = useState(note.title)
  const [body, setBody] = useState(note.body)

  function save(e: FormEvent) {
    e.preventDefault()
    upsertNote({
      ...note,
      title: title.trim() || 'Untitled',
      body,
      updatedAt: new Date().toISOString(),
    })
    onSaved()
  }

  function remove() {
    deleteNote(note.id)
    onDeleted()
  }

  return (
    <form className="stack" onSubmit={save}>
      <label className="field">
        <span>Title</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label className="field">
        <span>Body</span>
        <textarea
          rows={14}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Summarize odontogenic cysts, draw differential cues, paste AI prompts…"
        />
      </label>
      <div className="row-actions">
        <button type="submit" className="btn primary">
          Save
        </button>
        <button type="button" className="btn ghost" onClick={remove}>
          Delete
        </button>
      </div>
    </form>
  )
}

export function Notes() {
  const [tick, setTick] = useState(0)
  const [pickedId, setPickedId] = useState<string | null>(null)

  const notes = useMemo(() => {
    void tick
    return getNotes().sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  }, [tick])

  const activeId = pickedId ?? notes[0]?.id ?? null
  const active = activeId ? notes.find((n) => n.id === activeId) : undefined

  function fresh() {
    const n = createNote('New note', '')
    setTick((x) => x + 1)
    setPickedId(n.id)
  }

  return (
    <div className="page notes-layout">
      <h2>Notes</h2>
      <p className="muted">
        Lecture or clinic jotting tied to your study session (local only). Add structured summaries
        before quizzes.
      </p>
      <div className="notes-grid">
        <aside className="card notes-sidebar">
          <button type="button" className="btn primary wide" onClick={fresh}>
            New note
          </button>
          <ul className="notes-list">
            {notes.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  className={n.id === activeId ? 'note-tab active' : 'note-tab'}
                  onClick={() => setPickedId(n.id)}
                >
                  {n.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <section className="card notes-editor">
          {active ? (
            <NoteEditor
              key={active.id}
              note={active}
              onSaved={() => setTick((x) => x + 1)}
              onDeleted={() => {
                setTick((x) => x + 1)
                setPickedId(null)
              }}
            />
          ) : (
            <p>No note selected—create one to begin.</p>
          )}
        </section>
      </div>
    </div>
  )
}
