/**
 * Import all dental zip packs in public/models/sketchfab-import/
 * Run: npm run import-model-zips
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync, spawnSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const importDir = join(root, 'public', 'models', 'sketchfab-import')
const gallery = join(root, 'public', 'models', 'demo-gallery')
const assets = join(root, 'src', 'assets', 'models')
const convertScript = join(__dirname, 'convert-mesh-to-glb.mjs')
const unrar = 'C:\\Program Files\\WinRAR\\UnRAR.exe'

const PACKS = [
  {
    zip: 'free-teeth-base-mesh.zip',
    slug: 'free_teeth_base_mesh',
    label: 'Free teeth base mesh',
    note: 'From free-teeth-base-mesh.zip',
  },
  {
    zip: 'rigged-teeth-with-gums.zip',
    slug: 'rigged_teeth_with_gums',
    label: 'Rigged teeth with gums',
    note: 'From rigged-teeth-with-gums.zip (teeth.fbx)',
  },
]

function extractZip(zipPath, destDir) {
  mkdirSync(destDir, { recursive: true })
  execSync(
    `powershell -NoProfile -Command "Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${destDir.replace(/'/g, "''")}' -Force"`,
    { stdio: 'pipe' },
  )
}

function extractRar(rarPath, destDir) {
  mkdirSync(destDir, { recursive: true })
  if (existsSync(unrar)) {
    execSync(`"${unrar}" x -y "${rarPath}" "${destDir}\\"`, { stdio: 'pipe' })
  }
}

function walkFiles(dir, exts) {
  const out = []
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) out.push(...walkFiles(p, exts))
    else if (exts.some((e) => name.toLowerCase().endsWith(e))) out.push(p)
  }
  return out
}

function findBestMesh(extractRoot) {
  let glbs = walkFiles(extractRoot, ['.glb'])
  if (glbs.length === 0) {
    const rars = walkFiles(extractRoot, ['.rar'])
    for (const r of rars) {
      const sub = join(dirname(r), '_rar')
      extractRar(r, sub)
      glbs.push(...walkFiles(sub, ['.glb']))
    }
  }
  if (glbs.length > 0) {
    glbs.sort((a, b) => statSync(b).size - statSync(a).size)
    return { path: glbs[0], kind: 'glb' }
  }

  const nested = walkFiles(extractRoot, ['.zip'])
  for (const z of nested) {
    const sub = join(dirname(z), '_nested')
    extractZip(z, sub)
    const inner = findBestMesh(sub)
    if (inner) return inner
  }

  const fbx = walkFiles(extractRoot, ['.fbx'])
  if (fbx.length) {
    fbx.sort((a, b) => statSync(b).size - statSync(a).size)
    return { path: fbx[0], kind: 'convert' }
  }

  const obj = walkFiles(extractRoot, ['.obj'])
  if (obj.length) {
    obj.sort((a, b) => statSync(b).size - statSync(a).size)
    return { path: obj[0], kind: 'convert' }
  }

  return null
}

function convertToGlb(inputPath, outputPath) {
  const r = spawnSync(process.execPath, [convertScript, inputPath, outputPath], {
    stdio: 'inherit',
    cwd: root,
    env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=8192' },
  })
  if (r.status !== 0) throw new Error(`Convert failed: ${inputPath}`)
}

const manifest = { models: [] }

mkdirSync(gallery, { recursive: true })
mkdirSync(assets, { recursive: true })

for (const pack of PACKS) {
  const zipPath = join(importDir, pack.zip)
  if (!existsSync(zipPath)) {
    const alt = join(root, pack.zip)
    const dl = join('C:\\Users\\PC\\Downloads', pack.zip)
    const cv = join('C:\\Users\\PC\\Downloads\\cv 34', pack.zip)
    const src = existsSync(alt) ? alt : existsSync(dl) ? dl : existsSync(cv) ? cv : null
    if (src) {
      copyFileSync(src, zipPath)
      console.log('Copied', pack.zip, 'into sketchfab-import/')
    } else {
      console.warn('Skip (missing):', pack.zip)
      continue
    }
  }

  const workDir = join(importDir, pack.slug)
  const extractRoot = join(workDir, '_extract')
  if (existsSync(extractRoot)) {
    execSync(`powershell -Command "Remove-Item -LiteralPath '${extractRoot.replace(/'/g, "''")}' -Recurse -Force"`, {
      stdio: 'pipe',
    })
  }
  extractZip(zipPath, extractRoot)

  const mesh = findBestMesh(extractRoot)
  if (!mesh) {
    console.warn('No mesh in', pack.zip)
    continue
  }

  const outName = `${pack.slug}.glb`
  const galleryPath = join(gallery, outName)
  const assetPath = join(assets, outName)

  if (mesh.kind === 'glb') {
    copyFileSync(mesh.path, galleryPath)
    copyFileSync(mesh.path, assetPath)
  } else {
    console.log('Converting', basename(mesh.path), '→', outName)
    convertToGlb(mesh.path, galleryPath)
    copyFileSync(galleryPath, assetPath)
  }

  manifest.models.push({
    id: pack.slug,
    label: pack.label,
    file: `models/demo-gallery/${outName}`,
    note: pack.note,
    importedAt: new Date().toISOString(),
  })
  console.log('OK', pack.label, '→', outName)
}

writeFileSync(join(root, 'src', 'data', 'sketchfabImports.json'), JSON.stringify(manifest, null, 2) + '\n')
console.log('\nUpdated src/data/sketchfabImports.json with', manifest.models.length, 'models.')
