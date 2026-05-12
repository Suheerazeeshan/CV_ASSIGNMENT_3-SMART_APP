import { readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const quizPath = join(__dirname, '..', 'public', 'quizzes', 'quiz-cysts-review.json')
const quiz = JSON.parse(readFileSync(quizPath, 'utf8'))

const answers = Object.fromEntries(
  quiz.questions.map((q) => [q.id, q.correctOptionId]),
)

let score = 0
for (const q of quiz.questions) {
  if (answers[q.id] === q.correctOptionId) score++
}

const attempt = {
  id: randomUUID(),
  quizId: quiz.id,
  studentName: 'Demo Student',
  score,
  total: quiz.questions.length,
  answers,
  completedAt: new Date().toISOString(),
}

const pct = Math.round((attempt.score / attempt.total) * 100)

console.log(`Quiz: ${quiz.title}`)
console.log(`Student: ${attempt.studentName}`)
console.log(`Score: ${attempt.score}/${attempt.total} (${pct}%)`)
console.log('')
console.log('Faculty report row:')
console.log(
  [
    new Date(attempt.completedAt).toLocaleString(),
    attempt.studentName,
    quiz.title,
    `${attempt.score}/${attempt.total} (${pct}%)`,
  ].join(' | '),
)
console.log('')
console.log('Answer key used:')
for (const q of quiz.questions) {
  const chosen = q.options.find((o) => o.id === answers[q.id])
  console.log(`- ${q.prompt}`)
  console.log(`  → ${chosen?.text ?? answers[q.id]}`)
}
