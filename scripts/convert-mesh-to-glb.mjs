/**
 * Convert FBX/OBJ (+MTL) to GLB for the web viewer.
 * Usage: node scripts/convert-mesh-to-glb.mjs <input> <output.glb>
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'

globalThis.FileReader = class FileReader {
  result = null
  onloadend = null
  readAsArrayBuffer(blob) {
    Promise.resolve(blob.arrayBuffer()).then((ab) => {
      this.result = ab
      this.onloadend?.()
    })
  }
}

const input = resolve(process.argv[2])
const output = resolve(process.argv[3])
if (!input || !output) {
  console.error('Usage: node scripts/convert-mesh-to-glb.mjs <input.fbx|obj> <output.glb>')
  process.exit(1)
}

const THREE = await import('three')
const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js')
const { Scene } = THREE

const ext = input.toLowerCase().split('.').pop()
let root

if (ext === 'fbx') {
  const { FBXLoader } = await import('three/examples/jsm/loaders/FBXLoader.js')
  const buf = readFileSync(input)
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
  root = new FBXLoader().parse(ab)
} else if (ext === 'obj') {
  const { OBJLoader } = await import('three/examples/jsm/loaders/OBJLoader.js')
  const { MTLLoader } = await import('three/examples/jsm/loaders/MTLLoader.js')
  const dir = dirname(input) + '/'
  const mtlPath = join(dirname(input), basename(input, '.obj') + '.mtl')
  const objLoader = new OBJLoader()
  if (existsSync(mtlPath)) {
    const mtlLoader = new MTLLoader()
    mtlLoader.setPath(dir)
    mtlLoader.setResourcePath(dir)
    const materials = mtlLoader.parse(readFileSync(mtlPath, 'utf8'))
    materials.preload()
    objLoader.setMaterials(materials)
  }
  root = objLoader.parse(readFileSync(input, 'utf8'))
} else {
  console.error('Unsupported format:', ext)
  process.exit(1)
}

const scene = new Scene()
scene.add(root)

const exporter = new GLTFExporter()
const buffer = await exporter.parseAsync(scene, { binary: true })
mkdirSync(dirname(output), { recursive: true })
writeFileSync(output, Buffer.from(buffer))
console.log('Wrote', output, `(${(buffer.byteLength / 1024).toFixed(1)} KB)`)
