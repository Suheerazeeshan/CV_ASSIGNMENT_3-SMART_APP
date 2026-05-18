/**
 * Build sample lecture PDF(s) from public/sample-lectures/lecture-content.json
 * Edit that JSON to choose the text used for quiz generation, then run:
 *   npm run sample-pdf
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const contentPath = join(root, 'public', 'sample-lectures', 'lecture-content.json')

function wrapLine(font, text, size, maxWidth) {
  const words = text.split(/\s+/)
  const lines = []
  let line = ''
  for (const w of words) {
    const next = line ? `${line} ${w}` : w
    if (font.widthOfTextAtSize(next, size) > maxWidth && line) {
      lines.push(line)
      line = w
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

async function buildPdf({ title, subtitle, paragraphs }) {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.TimesRoman)
  const bold = await pdf.embedFont(StandardFonts.TimesRomanBold)
  const bodySize = 11
  const lineHeight = bodySize * 1.4
  const margin = 56
  const pageSize = [595.28, 841.89]
  let page = pdf.addPage(pageSize)
  let y = page.getHeight() - margin
  const maxWidth = page.getWidth() - margin * 2

  page.drawText(title, { x: margin, y, size: 16, font: bold, color: rgb(0.08, 0.1, 0.15) })
  y -= lineHeight * 1.8
  if (subtitle) {
    for (const line of wrapLine(font, subtitle, 10, maxWidth)) {
      page.drawText(line, { x: margin, y, size: 10, font, color: rgb(0.35, 0.38, 0.45) })
      y -= lineHeight
    }
    y -= lineHeight * 0.6
  }

  for (const p of paragraphs) {
    const lines = wrapLine(font, p, bodySize, maxWidth)
    for (const line of lines) {
      if (y < margin + lineHeight * 2) {
        page = pdf.addPage(pageSize)
        y = page.getHeight() - margin
      }
      page.drawText(line, { x: margin, y, size: bodySize, font, color: rgb(0.12, 0.14, 0.18) })
      y -= lineHeight
    }
    y -= lineHeight * 0.5
  }

  return pdf.save()
}

async function main() {
  const content = JSON.parse(readFileSync(contentPath, 'utf8'))
  const bytes = await buildPdf(content)

  const outDir = join(root, 'public', 'sample-lectures')
  mkdirSync(outDir, { recursive: true })

  const primary = join(outDir, 'odontogenic-oral-pathology-lecture.pdf')
  const legacy = join(root, 'public', 'sample-odontogenic-lecture.pdf')

  writeFileSync(primary, bytes)
  writeFileSync(legacy, bytes)

  console.log('Wrote', primary)
  console.log('Wrote', legacy)
  console.log('\nEdit public/sample-lectures/lecture-content.json then run npm run sample-pdf to rebuild.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
