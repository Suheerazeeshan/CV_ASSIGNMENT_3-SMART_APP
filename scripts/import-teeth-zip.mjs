/**
 * Extract free-teeth-base-mesh.zip and import Teeth_Base_Mesh_Modeling.glb into the app.
 * Run: npm run import-teeth-zip
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const zipCandidates = [
  join(root, 'public', 'models', 'sketchfab-import', 'free-teeth-base-mesh.zip'),
  join(root, 'free-teeth-base-mesh.zip'),
  'C:\\Users\\PC\\Downloads\\free-teeth-base-mesh.zip',
]

function findZip() {
  for (const p of zipCandidates) if (existsSync(p)) return p
  return null
}

function extractZip(zipPath, destDir) {
  mkdirSync(destDir, { recursive: true })
  execSync(
    `powershell -NoProfile -Command "Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${destDir.replace(/'/g, "''")}' -Force"`,
    { stdio: 'inherit' },
  )
}

function walkFiles(dir, ext) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) out.push(...walkFiles(p, ext))
    else if (name.toLowerCase().endsWith(ext)) out.push(p)
  }
  return out
}

const zipPath = findZip()
if (!zipPath) {
  console.error('Place free-teeth-base-mesh.zip in Downloads or public/models/sketchfab-import/')
  process.exit(1)
}

const workDir = join(root, 'public', 'models', 'sketchfab-import', 'free-teeth-base-mesh')
const extractRoot = join(workDir, '_extract')
mkdirSync(workDir, { recursive: true })
extractZip(zipPath, extractRoot)

let glbs = walkFiles(extractRoot, '.glb')
if (glbs.length === 0) {
  const nested = walkFiles(extractRoot, '.zip')
  for (const z of nested) {
    const sub = join(dirname(z), basename(z, '.zip') + '_unzipped')
    extractZip(z, sub)
    glbs.push(...walkFiles(sub, '.glb'))
  }
}

if (glbs.length === 0) {
  console.error('No .glb found inside zip.')
  process.exit(1)
}

glbs.sort((a, b) => statSync(b).size - statSync(a).size)
const sourceGlb = glbs[0]
const buf = readFileSync(sourceGlb)
if (buf.toString('utf8', 0, 4) !== 'glTF') {
  console.error('Selected file is not a valid binary GLB.')
  process.exit(1)
}

const gallery = join(root, 'public', 'models', 'demo-gallery')
const assets = join(root, 'src', 'assets', 'models')
mkdirSync(gallery, { recursive: true })
mkdirSync(assets, { recursive: true })

const outName = 'free_teeth_base_mesh.glb'
copyFileSync(sourceGlb, join(gallery, outName))
copyFileSync(sourceGlb, join(assets, outName))

console.log('Imported free teeth base mesh from:', basename(zipPath))
console.log('  Source GLB:', sourceGlb)
console.log('  Gallery:   ', join(gallery, outName))
console.log('  Asset:     ', join(assets, outName))
console.log('\nDefault is set in src/data/jawModel3d.ts — restart dev server and refresh.')
