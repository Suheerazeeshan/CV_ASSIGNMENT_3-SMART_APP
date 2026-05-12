import { chromium } from 'playwright'

const base = process.env.APP_URL ?? 'http://localhost:5174'

async function login(page, role, name) {
  await page.goto(`${base}/`)
  await page.locator('select').selectOption(role)
  await page.getByPlaceholder(role === 'faculty' ? 'Dr. Example' : 'Your name').fill(name)
  await page.getByPlaceholder('Class or demo password').fill('demo123')
  await page.getByRole('button', { name: 'Log in' }).click()
  await page.waitForURL(/\/app\//)
}

const browser = await chromium.launch({ headless: true, channel: 'msedge' })
const page = await browser.newPage()

try {
  await login(page, 'student', 'Demo Student')
  await page.goto(`${base}/app/student/quiz/pub-cysts-review`)
  await page.getByLabel('Radicular (periapical) cyst at a necrotic apex').check()
  await page.getByLabel('Dentigerous (follicular) cyst').check()
  await page.getByLabel('Higher recurrence risk and aggressive behavior in many cases').check()
  await page.getByLabel('Radicular cyst formation at the involved apex').check()
  await page.getByRole('button', { name: 'Submit attempt' }).click()
  await page.waitForSelector('.success')
  const studentResult = (await page.locator('.success').textContent())?.trim()

  await page.getByRole('button', { name: 'Log out' }).click()
  await page.waitForURL(`${base}/`)

  await login(page, 'faculty', 'Dr. Demo')
  await page.goto(`${base}/app/faculty/reports`)
  await page.waitForSelector('table.data-table')
  const reportTable = (await page.locator('table.data-table').innerText())?.trim()

  console.log('--- Student result ---')
  console.log(studentResult)
  console.log('--- Faculty report ---')
  console.log(reportTable)
} finally {
  await browser.close()
}
