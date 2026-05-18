/**
 * Copy a Sketchfab .glb into the app (demo-gallery + bundled assets).
 *
 * Usage:
 *   npm run import-sketchfab-glb -- "C:\Users\PC\Downloads\model.glb" mandible "Human mandible (Sketchfab)"
 *
 * Or drop your file as:
 *   public/models/sketchfab-import/incoming.glb
 * then run:
 *   npm run import-sketchfab-glb
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const incoming = join(root, 'public', 'models', 'sketchfab-import', 'incoming.glb')
const gallery = join(root, 'public', 'models', 'demo-gallery')
const assets = join(root, 'src', 'assets', 'models')
const manifestPath = join(root, 'src', 'data', 'sketchfabImports.json')

const args = process.argv.slice(2)
let sourcePath = args[0]
let slug = args[1] ?? 'sketchfab_model'
let label = args[2] ?? 'Sketchfab model'

if (!sourcePath && existsSync(incoming)) {
  sourcePath = incoming
  slug = 'sketchfab_import'
  label = 'Sketchfab import (incoming.glb)'
}

if (!sourcePath || !existsSync(sourcePath)) {
  console.error(`
Usage:
  npm run import-sketchfab-glb -- "<path-to-downloaded.glb>" <slug> "<label>"

Or save Sketchfab download as:
  public/models/sketchfab-import/incoming.glb
then run:
  npm run import-sketchfab-glb
`)
  process.exit(1)
}

const buf = readFileSync(sourcePath)
if (buf.length < 12 || buf.toString('utf8', 0, 4) !== 'glTF') {
  console.error('File does not look like a binary .glb (missing glTF header).')
  process.exit(1)
}

slug = slug.replace(/[^a-z0-9_-]/gi, '_').toLowerCase()
const fileName = `sketchfab_${slug}.glb`

mkdirSync(gallery, { recursive: true })
mkdirSync(assets, { recursive: true })

const galleryPath = join(gallery, fileName)
const assetPath = join(assets, fileName)

copyFileSync(sourcePath, galleryPath)
copyFileSync(sourcePath, assetPath)

let manifest = { models: [] }
if (existsSync(manifestPath)) {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
}

const entry = {
  id: slug,
  label,
  file: `models/demo-gallery/${fileName}`,
  note: `Imported from Sketchfab (${basename(sourcePath)}).`,
  importedAt: new Date().toISOString(),
}

const idx = manifest.models.findIndex((m) => m.id === slug)
if (idx >= 0) manifest.models[idx] = entry
else manifest.models.push(entry)

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')

console.log('Imported:', label)
console.log('  Gallery:', galleryPath)
console.log('  Asset:  ', assetPath)
console.log('  Manifest:', manifestPath)
console.log(`\nRestart dev server, then open 3D models → "${label}" in the gallery.`)
