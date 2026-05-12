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

/**
 * Reliable GLB preview using Three.js (avoids <model-viewer> blank-canvas issues on some setups).
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
    const height = Math.max(container.clientHeight, 400)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1e293b)

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.001, 5000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    const hemi = new THREE.HemisphereLight(0xffffff, 0x334155, 1.15)
    scene.add(hemi)
    const key = new THREE.DirectionalLight(0xffffff, 1.35)
    key.position.set(4, 9, 6)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xf8fafc, 0.55)
    fill.position.set(-5, 2, 4)
    scene.add(fill)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06

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
        scene.add(gltf.scene)
        addPathologyOverlays(gltf.scene, markers)

        const box = new THREE.Box3().setFromObject(gltf.scene)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z, 1e-6)
        const dist = maxDim * 2.4

        camera.position.set(center.x + dist * 0.55, center.y + dist * 0.35, center.z + dist * 0.55)
        camera.near = maxDim / 100
        camera.far = maxDim * 100
        camera.updateProjectionMatrix()

        controls.target.copy(center)
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
      const h = Math.max(container.clientHeight, 400)
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

  return <div ref={containerRef} className="glb-three-viewer" aria-label="3D model canvas" />
}
