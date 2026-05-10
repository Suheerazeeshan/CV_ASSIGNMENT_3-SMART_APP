/**
 * Builds a stylized single-root tooth (lathe silhouette) → public/models/tooth.glb
 * Educational placeholder — reads as a tooth in silhouette, not clinical accuracy.
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

const { Scene, Mesh, MeshBasicMaterial, LatheGeometry, Vector2, Group } = THREE

/** Half-profile: x = radius from long axis, y = height (root tip → crown). */
function toothProfilePoints() {
  const tip = 0.0008
  return [
    new Vector2(tip, -0.069),
    new Vector2(0.007, -0.063),
    new Vector2(0.012, -0.054),
    new Vector2(0.016, -0.044),
    new Vector2(0.019, -0.032),
    new Vector2(0.021, -0.020),
    new Vector2(0.015, -0.011),
    new Vector2(0.012, -0.006),
    new Vector2(0.017, -0.001),
    new Vector2(0.023, 0.012),
    new Vector2(0.026, 0.024),
    new Vector2(0.025, 0.035),
    new Vector2(0.021, 0.045),
    new Vector2(0.014, 0.053),
    new Vector2(0.007, 0.058),
    new Vector2(0.003, 0.060),
  ].map((p) => new Vector2(Math.max(p.x, tip), p.y))
}

const scene = new Scene()
scene.name = 'EducationalToothPlaceholder'

/** Basic (unlit) so model-viewer always shows color without relying on IBL strength. */
const enamel = new MeshBasicMaterial({ color: 0xfff5eb })

const profile = toothProfilePoints()
const geo = new LatheGeometry(profile, 48)
geo.name = 'toothGeo'

const toothMesh = new Mesh(geo, enamel)
toothMesh.name = 'ToothMesh'

const tooth = new Group()
tooth.name = 'Tooth'
tooth.add(toothMesh)

scene.add(tooth)

const exporter = new GLTFExporter()
const buffer = await exporter.parseAsync(scene, { binary: true })
const out = join(__dirname, '..', 'public', 'models', 'tooth.glb')
writeFileSync(out, Buffer.from(buffer))
console.log('Wrote', out, `(${(buffer.byteLength / 1024).toFixed(1)} KB)`)
