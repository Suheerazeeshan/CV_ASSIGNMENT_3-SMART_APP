/**
 * Builds a detailed single-root molar (crown lathe, tapered root, CEJ, occlusal cusps) → GLB.
 * Educational asset — not a clinical scan.
 * Run: npm run generate-tooth-glb
 *
 * Node polyfill: Three's GLTFExporter uses browser FileReader for binary GLB.
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

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

const __dirname = dirname(fileURLToPath(import.meta.url))

const THREE = await import('three')
const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js')

const {
  Scene,
  Mesh,
  MeshStandardMaterial,
  LatheGeometry,
  TorusGeometry,
  SphereGeometry,
  Vector2,
  Group,
} = THREE

function crownProfilePoints() {
  const pairs = [
    [0.0075, -0.018],
    [0.0088, -0.014],
    [0.0115, -0.009],
    [0.0155, -0.004],
    [0.021, 0.006],
    [0.0265, 0.02],
    [0.0305, 0.036],
    [0.032, 0.052],
    [0.031, 0.066],
    [0.028, 0.078],
    [0.0235, 0.088],
    [0.0175, 0.095],
    [0.011, 0.099],
    [0.006, 0.101],
  ]
  return pairs.map(([x, y]) => new Vector2(x, y))
}

function rootProfilePoints() {
  const pairs = [
    [0.0075, -0.018],
    [0.0072, -0.026],
    [0.0068, -0.038],
    [0.006, -0.052],
    [0.0048, -0.066],
    [0.0036, -0.078],
    [0.0024, -0.088],
    [0.0014, -0.096],
    [0.0008, -0.102],
    [0.0005, -0.106],
  ]
  return pairs.map(([x, y]) => new Vector2(x, y))
}

function addOcclusalCusps(group, material, { tableY, tableRadius }) {
  const cuspGeo = new SphereGeometry(0.0072, 18, 16)
  const positions = [
    { a: 0.45, rMul: 0.94 },
    { a: Math.PI * 0.92, rMul: 0.88 },
    { a: Math.PI * 1.58, rMul: 0.9 },
    { a: Math.PI * 2.28, rMul: 0.86 },
  ]

  for (const { a, rMul } of positions) {
    const mesh = new Mesh(cuspGeo, material)
    const r = tableRadius * rMul * 0.8
    mesh.position.set(Math.cos(a) * r, tableY + 0.005, Math.sin(a) * r)
    mesh.scale.set(1.2, 1.65, 1.2)
    mesh.name = 'Cusp'
    group.add(mesh)
  }

  const groove = new Mesh(new SphereGeometry(0.0048, 14, 12), material)
  groove.position.set(0, tableY + 0.0015, 0)
  groove.scale.set(1.45, 0.32, 1.45)
  groove.name = 'CentralGroove'
  group.add(groove)
}

const scene = new Scene()
scene.name = 'EducationalMolar'

const enamel = new MeshStandardMaterial({
  color: 0xfff9f2,
  roughness: 0.34,
  metalness: 0.02,
})
const rootMat = new MeshStandardMaterial({
  color: 0xe3c4a3,
  roughness: 0.64,
  metalness: 0,
})
const cejRingMat = new MeshStandardMaterial({
  color: 0xd7b08f,
  roughness: 0.58,
  metalness: 0,
})

const segments = 128
const crownGeo = new LatheGeometry(crownProfilePoints(), segments)
crownGeo.name = 'CrownGeo'
const rootGeo = new LatheGeometry(rootProfilePoints(), segments)
rootGeo.name = 'RootGeo'

const tooth = new Group()
tooth.name = 'Molar'

const crownMesh = new Mesh(crownGeo, enamel)
crownMesh.name = 'Crown'
const rootMesh = new Mesh(rootGeo, rootMat)
rootMesh.name = 'Root'

const cejY = -0.018
const cejRing = new Mesh(new TorusGeometry(0.0078, 0.002, 12, 64), cejRingMat)
cejRing.rotation.x = Math.PI / 2
cejRing.position.y = cejY
cejRing.scale.set(1.06, 1, 0.95)
cejRing.name = 'CEJRing'

const crownTableY = 0.099
const crownTableR = 0.024

tooth.add(rootMesh)
tooth.add(crownMesh)
tooth.add(cejRing)
addOcclusalCusps(tooth, enamel, { tableY: crownTableY, tableRadius: crownTableR })

scene.add(tooth)

tooth.rotation.x = -0.1
tooth.rotation.z = 0.05
tooth.position.y = 0.01

const exporter = new GLTFExporter()
const buffer = await exporter.parseAsync(scene, { binary: true })
const buf = Buffer.from(buffer)

const modelsDir = join(__dirname, '..', 'public', 'models')
const outputs = [
  'single_tooth.glb',
  'tooth.glb',
  'manual-upload-sample-tooth.glb',
]

for (const name of outputs) {
  const path = join(modelsDir, name)
  writeFileSync(path, buf)
  console.log('Wrote', path, `(${(buf.byteLength / 1024).toFixed(1)} KB)`)
}
