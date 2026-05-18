/**
 * Colorful educational jaw meshes: lower, upper, and full mouth (.glb).
 * Run: npm run generate-anatomy-jaw-glb
 */
import { mkdirSync, writeFileSync } from 'node:fs'
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
  MeshPhysicalMaterial,
  LatheGeometry,
  TubeGeometry,
  CatmullRomCurve3,
  Vector2,
  Vector3,
  Group,
  Color,
} = THREE

const PALETTE = {
  enamel: 0xfffaf5,
  root: 0xe8c9a8,
  gum: 0xe06b6b,
  nerve: 0xffe033,
  artery: 0xe82222,
  vein: 0x2a4fd4,
  bone: 0xfff6ee,
}

function archCurve({ yBase = -0.012, radius = 0.11 }) {
  const pts = []
  const count = 32
  for (let i = 0; i <= count; i++) {
    const t = i / count
    const angle = Math.PI * 0.92 * (t - 0.5)
    const r = radius + 0.018 * Math.cos(angle * 2)
    const x = Math.sin(angle) * r
    const z = Math.cos(angle) * r - 0.02
    const y = yBase + 0.006 * Math.cos(angle * 1.5)
    pts.push(new Vector3(x, y, z))
  }
  return new CatmullRomCurve3(pts, false, 'centripetal')
}

function makeTube(curve, radius, material, name, segments = 64) {
  const geo = new TubeGeometry(curve, segments, radius, 12, false)
  const mesh = new Mesh(geo, material)
  mesh.name = name
  return mesh
}

function toothProfile() {
  return [
    [0.0038, -0.014],
    [0.0052, -0.008],
    [0.0078, 0.002],
    [0.0092, 0.012],
    [0.0088, 0.022],
    [0.007, 0.028],
    [0.0045, 0.031],
  ].map(([x, y]) => new Vector2(x, y))
}

function sharedMaterials() {
  const boneMat = new MeshPhysicalMaterial({
    color: PALETTE.bone,
    roughness: 0.38,
    metalness: 0,
    transparent: true,
    opacity: 0.42,
    transmission: 0.55,
    thickness: 0.08,
    side: 2,
    depthWrite: false,
  })
  const gumMat = new MeshStandardMaterial({
    color: PALETTE.gum,
    roughness: 0.48,
    metalness: 0,
  })
  const nerveMat = new MeshStandardMaterial({
    color: PALETTE.nerve,
    roughness: 0.35,
    emissive: new Color(PALETTE.nerve).multiplyScalar(0.12),
  })
  const arteryMat = new MeshStandardMaterial({
    color: PALETTE.artery,
    roughness: 0.4,
    emissive: new Color(PALETTE.artery).multiplyScalar(0.08),
  })
  const veinMat = new MeshStandardMaterial({
    color: PALETTE.vein,
    roughness: 0.4,
    emissive: new Color(PALETTE.vein).multiplyScalar(0.08),
  })
  return { boneMat, gumMat, nerveMat, arteryMat, veinMat }
}

function addTooth(group, curve, t, scale, label, { upper = false } = {}) {
  const pos = curve.getPointAt(t)
  const tangent = curve.getTangentAt(t).normalize()
  const tooth = new Group()
  tooth.name = label

  const enamel = new MeshStandardMaterial({
    color: PALETTE.enamel,
    roughness: 0.32,
    metalness: 0.02,
  })
  const rootMat = new MeshStandardMaterial({
    color: PALETTE.root,
    roughness: 0.62,
    metalness: 0,
  })

  const crown = new Mesh(new LatheGeometry(toothProfile(), 48), enamel)
  crown.name = 'Crown'
  const root = new Mesh(
    new LatheGeometry(toothProfile().map((p) => new Vector2(p.x * 0.72, p.y - 0.018)), 48),
    rootMat,
  )
  root.name = 'Root'
  root.scale.y = 1.15

  tooth.add(root)
  tooth.add(crown)
  tooth.scale.setScalar(scale)
  tooth.position.copy(pos)
  tooth.position.y += (upper ? -0.006 : 0.008) * scale

  const up = new Vector3(0, 1, 0)
  const axis = new Vector3().crossVectors(up, tangent)
  const angle = Math.acos(Math.max(-1, Math.min(1, up.dot(tangent))))
  if (axis.lengthSq() > 1e-8) tooth.setRotationFromAxisAngle(axis.normalize(), angle)
  tooth.rotateX(upper ? 0.42 : -0.35)
  tooth.rotateY(Math.atan2(pos.x, pos.z))
  if (upper) tooth.rotateZ(Math.PI)

  group.add(tooth)
}

function branchVessel(parent, origin, dir, length, radius, material, name, depth = 0) {
  if (depth > 2) return
  const end = origin.clone().add(dir.clone().normalize().multiplyScalar(length))
  const curve = new CatmullRomCurve3([origin, end])
  parent.add(makeTube(curve, radius, material, `${name}_${depth}`, 16))
  if (depth < 2) {
    const side = new Vector3(-dir.z, 0.15, dir.x).normalize()
    branchVessel(
      parent,
      end,
      dir.clone().add(side.clone().multiplyScalar(0.55)).add(new Vector3(0, 0.08, 0)),
      length * 0.55,
      radius * 0.72,
      material,
      name,
      depth + 1,
    )
    branchVessel(
      parent,
      end,
      dir.clone().add(side.clone().multiplyScalar(-0.55)).add(new Vector3(0, 0.06, 0)),
      length * 0.5,
      radius * 0.7,
      material,
      name,
      depth + 1,
    )
  }
}

function buildJawArch({ kind }) {
  const upper = kind === 'upper'
  const jaw = new Group()
  jaw.name = upper ? 'UpperJaw' : 'LowerJaw'

  const yBase = upper ? 0.128 : -0.012
  const curve = archCurve({ yBase, radius: upper ? 0.105 : 0.11 })
  const { boneMat, gumMat, nerveMat, arteryMat, veinMat } = sharedMaterials()

  const boneRadius = upper ? 0.024 : 0.028
  const gumRadius = upper ? 0.012 : 0.014

  jaw.add(makeTube(curve, boneRadius, boneMat, upper ? 'MaxillaBone' : 'MandibleBone', 80))
  jaw.add(makeTube(curve, gumRadius, gumMat, 'Gingiva', 80))

  const teethGroup = new Group()
  teethGroup.name = 'Teeth'
  const toothCount = 14
  for (let i = 0; i < toothCount; i++) {
    const t = (i + 0.5) / toothCount
    const edge = Math.abs(t - 0.5) * 2
    const scale = 0.82 + (1 - edge) * (upper ? 0.32 : 0.35)
    addTooth(teethGroup, curve, t, scale, `Tooth_${i + 1}`, { upper })
  }
  jaw.add(teethGroup)

  const nerves = new Group()
  nerves.name = 'Nerves'
  nerves.add(
    makeTube(curve, 0.0032, nerveMat, upper ? 'SuperiorAlveolarNerve' : 'InferiorAlveolarNerve', 72),
  )
  for (let i = 0; i < toothCount; i++) {
    const t = (i + 0.5) / toothCount
    const base = curve.getPointAt(t)
    const tip = base.clone().add(new Vector3(0, upper ? -0.022 : 0.022, 0))
    nerves.add(makeTube(new CatmullRomCurve3([base, tip]), 0.0016, nerveMat, `DentalNerve_${i + 1}`, 12))
  }
  jaw.add(nerves)

  const vessels = new Group()
  vessels.name = 'Vessels'
  const posterior = curve.getPointAt(0.02)
  const anterior = curve.getPointAt(0.98)
  const yOff = upper ? 0.01 : -0.02
  branchVessel(
    vessels,
    posterior.clone().add(new Vector3(0, yOff, -0.04)),
    new Vector3(0.02, upper ? -0.1 : 0.12, 0.08),
    0.09,
    0.0038,
    arteryMat,
    'Artery',
  )
  branchVessel(
    vessels,
    posterior.clone().add(new Vector3(0, yOff - 0.005, -0.035)),
    new Vector3(-0.02, upper ? -0.09 : 0.1, 0.1),
    0.095,
    0.004,
    veinMat,
    'Vein',
  )
  branchVessel(
    vessels,
    anterior.clone().add(new Vector3(0, yOff + 0.01, 0.02)),
    new Vector3(0, upper ? -0.07 : 0.08, -0.06),
    0.05,
    0.0028,
    arteryMat,
    'AnteriorArtery',
  )
  branchVessel(
    vessels,
    anterior.clone().add(new Vector3(0, yOff, 0.025)),
    new Vector3(0, upper ? -0.065 : 0.07, -0.05),
    0.048,
    0.0026,
    veinMat,
    'AnteriorVein',
  )
  jaw.add(vessels)

  jaw.rotation.x = upper ? 0.1 : -0.12
  jaw.position.y = upper ? 0.04 : 0.02
  return jaw
}

function buildScene(name, jaws) {
  const scene = new Scene()
  scene.name = name
  for (const jaw of jaws) scene.add(jaw)
  return scene
}

async function exportGlb(scene, paths) {
  const exporter = new GLTFExporter()
  const buffer = await exporter.parseAsync(scene, { binary: true })
  const buf = Buffer.from(buffer)
  for (const path of paths) {
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, buf)
    console.log('Wrote', path, `(${(buf.byteLength / 1024).toFixed(1)} KB)`)
  }
}

const root = join(__dirname, '..')
const assetDir = join(root, 'src', 'assets', 'models')
const publicModels = join(root, 'public', 'models')
const gallery = join(publicModels, 'demo-gallery')

mkdirSync(assetDir, { recursive: true })
mkdirSync(gallery, { recursive: true })

const lower = buildJawArch({ kind: 'lower' })
const upper = buildJawArch({ kind: 'upper' })

await exportGlb(buildScene('MandibleAnatomyColor', [lower]), [
  join(publicModels, 'mandible_anatomy_color.glb'),
  join(assetDir, 'mandible_anatomy_color.glb'),
  join(gallery, 'mandible_anatomy_color.glb'),
])

await exportGlb(buildScene('MaxillaAnatomyColor', [upper]), [
  join(publicModels, 'maxilla_anatomy_color.glb'),
  join(assetDir, 'maxilla_anatomy_color.glb'),
  join(gallery, 'maxilla_anatomy_color.glb'),
])

await exportGlb(buildScene('FullMouthAnatomyColor', [lower, upper]), [
  join(publicModels, 'full_mouth_anatomy_color.glb'),
  join(assetDir, 'full_mouth_anatomy_color.glb'),
  join(gallery, 'full_mouth_anatomy_color.glb'),
])
