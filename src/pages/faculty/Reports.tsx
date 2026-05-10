import { getAttempts, getQuizzes } from '../../lib/storage'

export function Reports() {
  const attempts = getAttempts()
  const quizzes = getQuizzes()
  const titleById = new Map(quizzes.map((q) => [q.id, q.title]))
  const quizTitle = (id: string) => titleById.get(id) ?? id

  const rows = [...attempts].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
  )

  return (
    <div className="page">
      <h2>Student performance</h2>
      <p className="muted">Attempts stored locally from student accounts on this browser.</p>
      {rows.length === 0 ? (
        <p className="card">No attempts yet.</p>
      ) : (
        <div className="table-wrap card">
          <table className="data-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Student</th>
                <th>Quiz</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.completedAt).toLocaleString()}</td>
                  <td>{r.studentName}</td>
                  <td>{quizTitle(r.quizId)}</td>
                  <td>
                    {r.score}/{r.total} ({Math.round((r.score / r.total) * 100)}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
