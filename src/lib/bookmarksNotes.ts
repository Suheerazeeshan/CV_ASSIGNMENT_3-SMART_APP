import { v4 as uuidv4 } from 'uuid'

export interface Bookmark {
  id: string
  label: string
  href: string
  createdAt: string
}

export interface NoteEntry {
  id: string
  title: string
  body: string
  updatedAt: string
}

const BK = 'ope_bookmarks'
const NT = 'ope_notes'

export function getBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(BK)
    if (!raw) return []
    return JSON.parse(raw) as Bookmark[]
  } catch {
    return []
  }
}

export function addBookmark(label: string, href: string): Bookmark {
  const b: Bookmark = {
    id: uuidv4(),
    label: label.trim() || 'Bookmark',
    href,
    createdAt: new Date().toISOString(),
  }
  const list = getBookmarks().filter((x) => x.href !== href)
  list.push(b)
  localStorage.setItem(BK, JSON.stringify(list))
  return b
}

export function removeBookmark(id: string): void {
  localStorage.setItem(
    BK,
    JSON.stringify(getBookmarks().filter((x) => x.id !== id)),
  )
}

export function getNotes(): NoteEntry[] {
  try {
    const raw = localStorage.getItem(NT)
    if (!raw) return []
    return JSON.parse(raw) as NoteEntry[]
  } catch {
    return []
  }
}

export function saveNotes(list: NoteEntry[]): void {
  localStorage.setItem(NT, JSON.stringify(list))
}

export function upsertNote(entry: NoteEntry): void {
  const list = getNotes().filter((n) => n.id !== entry.id)
  list.push(entry)
  saveNotes(list)
}

export function deleteNote(id: string): void {
  saveNotes(getNotes().filter((n) => n.id !== id))
}

export function createNote(title: string, body: string): NoteEntry {
  const n: NoteEntry = {
    id: uuidv4(),
    title: title.trim() || 'Untitled',
    body,
    updatedAt: new Date().toISOString(),
  }
  upsertNote(n)
  return n
}
