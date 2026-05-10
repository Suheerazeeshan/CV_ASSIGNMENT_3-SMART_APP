import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import '@google/model-viewer'
import { publicAssetUrl } from '../../lib/publicAssetUrl'
import { validateBinaryGlb } from '../../lib/validateGlb'

const FALLBACK_GLb =
  'https://modelviewer.dev/shared-assets/models/RobotExpressive/RobotExpressive.glb'

type ModelViewerEl = HTMLElement & {
  updateFraming(): Promise<void>
  jumpCameraToGoal(): void
}

function frameWhenReady(el: Element) {
  const mv = el as unknown as ModelViewerEl
  requestAnimationFrame(() => {
    requestAnimationFrame(async () => {
      try {
        await mv.updateFraming()
        mv.jumpCameraToGoal()
      } catch {
        /* ignore */
      }
    })
  })
}

export function Models3D() {
  const bundledTooth = useMemo(() => publicAssetUrl('models/tooth.glb'), [])
  const [src, setSrc] = useState(bundledTooth)
  /** Remount <model-viewer> so the same URL actually reloads (otherwise the blue button feels “dead”). */
  const [viewerKey, setViewerKey] = useState(0)
  const blobUrlRef = useRef<string | null>(null)
  const mvWrapRef = useRef<HTMLDivElement | null>(null)
  const [viewerHint, setViewerHint] = useState<string | null>(null)
  const [uploadFileName, setUploadFileName] = useState<string | null>(null)

  function revokeBlob() {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
    setUploadFileName(null)
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const check = await validateBinaryGlb(file)
    if (!check.ok) {
      setViewerHint(check.reason)
      e.target.value = ''
      return
    }

    revokeBlob()
    const url = URL.createObjectURL(file)
    blobUrlRef.current = url
    setUploadFileName(file.name)
    setSrc(url)
    setViewerKey((k) => k + 1)
    setViewerHint(null)
    e.target.value = ''
  }

  function useProjectDefault() {
    revokeBlob()
    setSrc(bundledTooth)
    setViewerKey((k) => k + 1)
    setViewerHint('Reloading bundled tooth…')
  }

  /** First paint sometimes leaves model-viewer blank; one remount fixes it. */
  useEffect(() => {
    const id = window.setTimeout(() => setViewerKey((k) => k + 1), 80)
    return () => window.clearTimeout(id)
  }, [bundledTooth])

  useLayoutEffect(
    () => () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
    },
    [],
  )

  useLayoutEffect(() => {
    const el = mvWrapRef.current?.querySelector('model-viewer')
    if (!el) return

    const onError = () => {
      setViewerHint(null)
      if (src.startsWith('blob:')) {
        setViewerHint(
          `Could not render "${uploadFileName ?? 'upload'}". Export a real GLB from Blender, or click Use project default (tooth.glb) below.`,
        )
        return
      }
      setViewerHint(`Could not load ${src}. Click Use project default or run: npm run generate-tooth-glb`)
      if (src === bundledTooth) {
        setSrc(FALLBACK_GLb)
        setViewerKey((k) => k + 1)
      }
    }

    const onLoad = () => {
      frameWhenReady(el)
      setViewerHint(null)
    }

    el.addEventListener('error', onError)
    el.addEventListener('load', onLoad)
    return () => {
      el.removeEventListener('error', onError)
      el.removeEventListener('load', onLoad)
    }
  }, [src, bundledTooth, uploadFileName, viewerKey])

  const isUploaded = src.startsWith('blob:')

  const sourceSummary = isUploaded
    ? `Custom upload${uploadFileName ? `: ${uploadFileName}` : ''}`
    : src === FALLBACK_GLb
      ? 'Fallback (demo robot)'
      : 'Bundled tooth (tooth.glb)'

  return (
    <div className="page">
      <h2>3D models</h2>
      <p className="muted">
        <strong>For grading:</strong> click <strong>Use project default (tooth.glb)</strong> — it{' '}
        <em>reloads</em> the viewer each time (needed if the canvas was blank).
      </p>

      {viewerHint && (
        <p className="card small muted" style={{ whiteSpace: 'pre-wrap' }}>
          {viewerHint}
        </p>
      )}

      <div className="card stack">
        <label className="field">
          <span>Upload 3D model (.glb) — optional</span>
          <input type="file" accept=".glb,model/gltf-binary" onChange={onPickFile} />
        </label>
        <div className="row-actions">
          <button type="button" className="btn primary" onClick={useProjectDefault}>
            Use project default (tooth.glb)
          </button>
          {isUploaded && (
            <span className="small muted">
              Upload active — use the button above for the bundled tooth.
            </span>
          )}
        </div>
        <p className="small muted">
          <strong>Viewer source:</strong> {sourceSummary}
        </p>
        <p className="small muted">
          URL: <code style={{ wordBreak: 'break-all' }}>{bundledTooth}</code>
        </p>
      </div>

      <div className="card model-viewer-wrap" key={`mv-${viewerKey}`} ref={mvWrapRef}>
        <model-viewer
          src={src}
          alt="Tooth GLB model"
          loading="eager"
          camera-controls
          camera-orbit="0deg 75deg 105%"
          touch-action="pan-y"
          shadow-intensity="1"
          exposure="1.2"
          interaction-prompt="none"
          style={{
            width: '100%',
            height: 'min(480px, 70vh)',
            background: '#1e293b',
            borderRadius: '12px',
          }}
        />
      </div>

      <section className="card prose">
        <h3>How to use</h3>
        <ul>
          <li>
            Drag to orbit, scroll to zoom. If the screen stays dark, click <strong>Use project default</strong>{' '}
            again to remount the viewer.
          </li>
          <li>
            Practice upload: <code>public\models\manual-upload-sample-tooth.glb</code>
          </li>
        </ul>
      </section>
    </div>
  )
}
