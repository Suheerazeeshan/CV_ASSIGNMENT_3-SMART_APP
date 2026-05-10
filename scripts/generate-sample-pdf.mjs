/**
 * Generates public/sample-odontogenic-lecture.pdf for testing Upload PDF → quiz.
 * Run: node scripts/generate-sample-pdf.mjs
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const __dirname = dirname(fileURLToPath(import.meta.url))

const paragraphs = [
  `Odontogenic cysts are epithelial-lined cavities derived from remnants of the tooth-forming apparatus and represent a core topic in oral pathology education.`,
  `Radicular cysts typically arise from inflammatory stimulation at the apex of a non-vital tooth and are among the most frequently encountered jaw cysts in clinical practice.`,
  `Dentigerous cysts envelop the crown of an unerupted tooth and are considered developmental lesions associated with impacted teeth rather than purely inflammatory processes.`,
  `The odontogenic keratocyst may behave aggressively with higher recurrence risk compared with many other cystic lesions, prompting vigilant radiographic follow-up after surgical treatment.`,
  `Ameloblastoma is the most common benign odontogenic epithelial tumor and often presents as a slowly expansile radiolucency favoring the posterior mandible on panoramic imaging.`,
  `Clinical correlation among patient age, tooth vitality testing, radiographic borders, and eventual histopathology remains essential when distinguishing inflammatory cysts from keratocystic odontogenic lesions.`,
  `Myxoma and odontogenic fibroma illustrate mesenchymal odontogenic tumors that require careful imaging assessment because local infiltration can challenge conservative surgical planning.`,
  `Students preparing for boards should practice articulating why inflammatory radicular disease differs from developmental dentigerous pathology despite overlapping jaw radiolucencies.`,
]

async function main() {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.TimesRoman)
  const size = 11
  const lineHeight = size * 1.35
  let page = pdf.addPage([595.28, 841.89])
  const margin = 56
  let x = margin
  let y = page.getHeight() - margin

  page.drawText('Sample lecture: Odontogenic oral pathology', {
    x,
    y,
    size: size + 4,
    font,
    color: rgb(0.1, 0.1, 0.15),
  })
  y -= lineHeight * 2

  for (const p of paragraphs) {
    const words = p.split(/\s+/)
    let line = ''
    for (const w of words) {
      const next = line ? `${line} ${w}` : w
      const width = font.widthOfTextAtSize(next, size)
      if (width > page.getWidth() - margin * 2 && line) {
        if (y < margin + lineHeight * 3) {
          page = pdf.addPage([595.28, 841.89])
          y = page.getHeight() - margin
        }
        page.drawText(line, { x, y, size, font, color: rgb(0.15, 0.15, 0.2) })
        y -= lineHeight
        line = w
      } else {
        line = next
      }
    }
    if (line) {
      if (y < margin + lineHeight * 3) {
        page = pdf.addPage([595.28, 841.89])
        y = page.getHeight() - margin
      }
      page.drawText(line, { x, y, size, font, color: rgb(0.15, 0.15, 0.2) })
      y -= lineHeight * 1.6
    }
  }

  const bytes = await pdf.save()
  const out = join(__dirname, '..', 'public', 'sample-odontogenic-lecture.pdf')
  writeFileSync(out, bytes)
  console.log('Wrote', out)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
