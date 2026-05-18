import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { Pathology3DMarker } from '../data/pathologyModels3D'
import { markerWorldPosition } from '../lib/pathology3dAnchors'

type Props = {
  url: string
  markers?: Pathology3DMarker[]
  onLoad?: () => void
  onError?: (message: string) => void
}

function enhanceMaterials(root: THREE.Object3D) {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return
    child.castShadow = true
    child.receiveShadow = true
    const materials = Array.isArray(child.material) ? child.material : [child.material]
    for (const mat of materials) {
      if (!mat) continue
      if ('map' in mat && mat.map instanceof THREE.Texture) {
        mat.map.colorSpace = THREE.SRGBColorSpace
      }
      if ('emissiveMap' in mat && mat.emissiveMap instanceof THREE.Texture) {
        mat.emissiveMap.colorSpace = THREE.SRGBColorSpace
      }
      if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
        mat.side = THREE.DoubleSide
        mat.needsUpdate = true
      }
    }
  })
}

/**
 * GLB preview using Three.js with lighting tuned for full-color anatomical meshes.
 */
export function GlbViewer({ url, markers = [], onLoad, onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const onLoadRef = useRef(onLoad)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onLoadRef.current = onLoad
    onErrorRef.current = onError
  }, [onLoad, onError])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !url) return

    const width = Math.max(container.clientWidth, 320)
    const height = Math.max(container.clientHeight, 480)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0f172a)

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.001, 5000)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 0.55)
    scene.add(ambient)

    const hemi = new THREE.HemisphereLight(0xf0f9ff, 0x44403c, 0.85)
    scene.add(hemi)

    const key = new THREE.DirectionalLight(0xffffff, 1.5)
    key.position.set(6, 10, 8)
    key.castShadow = true
    scene.add(key)

    const fill = new THREE.DirectionalLight(0xe2e8f0, 0.65)
    fill.position.set(-8, 4, 6)
    scene.add(fill)

    const rim = new THREE.DirectionalLight(0x7dd3fc, 0.45)
    rim.position.set(0, 2, -10)
    scene.add(rim)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.enablePan = true
    controls.screenSpacePanning = true
    controls.panSpeed = 1.25
    controls.rotateSpeed = 0.85
    controls.minDistance = 0.01
    controls.maxDistance = 500
    // Left drag = move model left/right (pan); right drag = rotate; scroll = zoom
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE,
    }
    controls.touches = {
      ONE: THREE.TOUCH.PAN,
      TWO: THREE.TOUCH.DOLLY_ROTATE,
    }

    let raf = 0
    let disposed = false

    const animate = () => {
      if (disposed) return
      raf = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }

    function addPathologyOverlays(root: THREE.Object3D, items: Pathology3DMarker[]) {
      if (!items.length) return

      const box = new THREE.Box3().setFromObject(root)
      const maxDim = Math.max(...box.getSize(new THREE.Vector3()).toArray(), 1e-6)
      const group = new THREE.Group()
      group.name = 'PathologyOverlays'

      for (const marker of items) {
        const [x, y, z] = markerWorldPosition(box, marker)
        const radius = maxDim * marker.radiusScale
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(radius, 28, 22),
          new THREE.MeshStandardMaterial({
            color: marker.color,
            transparent: true,
            opacity: 0.42,
            roughness: 0.35,
            metalness: 0,
            depthWrite: false,
          }),
        )
        mesh.position.set(x, y, z)
        if (marker.scale) {
          mesh.scale.set(marker.scale[0], marker.scale[1], marker.scale[2])
        }
        mesh.name = marker.label
        group.add(mesh)
      }

      scene.add(group)
    }

    const loader = new GLTFLoader()
    loader.load(
      url,
      (gltf) => {
        if (disposed) return
        enhanceMaterials(gltf.scene)
        scene.add(gltf.scene)
        addPathologyOverlays(gltf.scene, markers)

        const box = new THREE.Box3().setFromObject(gltf.scene)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z, 1e-6)
        const dist = maxDim * 2.2

        camera.position.set(center.x + dist * 0.5, center.y + dist * 0.28, center.z + dist * 0.65)
        camera.near = maxDim / 200
        camera.far = maxDim * 100
        camera.updateProjectionMatrix()

        controls.target.copy(center)
        controls.minDistance = maxDim * 0.35
        controls.maxDistance = maxDim * 6
        controls.update()

        animate()
        onLoadRef.current?.()
      },
      undefined,
      (err) => {
        if (disposed) return
        const msg = err instanceof Error ? err.message : String(err)
        onErrorRef.current?.(msg)
      },
    )

    const ro = new ResizeObserver(() => {
      if (!container || disposed) return
      const w = Math.max(container.clientWidth, 320)
      const h = Math.max(container.clientHeight, 480)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    })
    ro.observe(container)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      controls.dispose()
      scene.clear()
      renderer.dispose()
      const el = renderer.domElement
      if (el.parentNode === container) {
        container.removeChild(el)
      }
    }
  }, [url, markers])

  return (
    <div
      ref={containerRef}
      className="glb-three-viewer"
      aria-label="3D model canvas — drag to move, right-drag to rotate, scroll to zoom"
    />
  )
}

