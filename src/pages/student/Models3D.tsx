import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { GlbViewer } from '../../components/GlbViewer'
import { PATHOLOGY_3D_CASES } from '../../data/pathologyModels3D'
import { TOOTH_DEMO_GALLERY_FOLDER, TOOTH_DEMO_GLB_SAMPLES } from '../../data/toothDemoGallery'
import { publicAssetUrl } from '../../lib/publicAssetUrl'
import { validateBinaryGlb } from '../../lib/validateGlb'

const FALLBACK_GLb =
  'https://modelviewer.dev/shared-assets/models/RobotExpressive/RobotExpressive.glb'

export function Models3D() {
  const bundledModel = useMemo(() => publicAssetUrl('models/single_tooth.glb'), [])
  const [src, setSrc] = useState(bundledModel)
  const [viewerKey, setViewerKey] = useState(0)
  const [caseId, setCaseId] = useState(PATHOLOGY_3D_CASES[0].id)
  const blobUrlRef = useRef<string | null>(null)
  const [viewerHint, setViewerHint] = useState<string | null>(null)
  const [uploadFileName, setUploadFileName] = useState<string | null>(null)
  const [galleryLabel, setGalleryLabel] = useState<string | null>(null)

  const demoSamples = useMemo(
    () =>
      TOOTH_DEMO_GLB_SAMPLES.map((sample) => ({
        ...sample,
        url: publicAssetUrl(sample.file),
      })),
    [],
  )

  const activeCase = useMemo(
    () => PATHOLOGY_3D_CASES.find((c) => c.id === caseId) ?? PATHOLOGY_3D_CASES[0],
    [caseId],
  )

  function revokeBlob() {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
    setUploadFileName(null)
    setGalleryLabel(null)
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
    setGalleryLabel(null)
    setSrc(url)
    setViewerKey((k) => k + 1)
    setViewerHint(null)
    e.target.value = ''
  }

  function loadDemoSample(url: string, label: string) {
    revokeBlob()
    setGalleryLabel(label)
    setSrc(url)
    setViewerKey((k) => k + 1)
    setViewerHint(null)
  }

  function useProjectDefault() {
    revokeBlob()
    setSrc(bundledModel)
    setViewerKey((k) => k + 1)
    setViewerHint(null)
  }

  const isUploaded = src.startsWith('blob:')

  const sourceSummary = isUploaded
    ? `Custom upload${uploadFileName ? `: ${uploadFileName}` : ''}`
    : galleryLabel
      ? `Demo gallery: ${galleryLabel}`
      : src === FALLBACK_GLb
        ? 'Fallback (demo robot)'
        : 'Bundled tooth (single_tooth.glb)'

  return (
    <div className="page">
      <h2>3D models</h2>
      <p className="muted">
        Explore odontogenic pathology on a <strong>single tooth</strong> mesh. Pick a teaching
        scenario to place translucent 3D overlays (cystic radiolucency, pericoronal expansion,
        cortical breach), then orbit and zoom. Overlays are educational markers, not a diagnosis.
      </p>

      {viewerHint && (
        <p className="card small muted" style={{ whiteSpace: 'pre-wrap' }}>
          {viewerHint}
        </p>
      )}

      <section className="card stack">
        <h3>Pathology scenarios</h3>
        <div className="pathology-case-grid">
          {PATHOLOGY_3D_CASES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={c.id === caseId ? 'pathology-case active' : 'pathology-case'}
              onClick={() => {
                setCaseId(c.id)
                setViewerKey((k) => k + 1)
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
        <p className="small muted">
          <strong>Category:</strong> {activeCase.category} · <strong>Imaging cue:</strong>{' '}
          {activeCase.imagingCue}
        </p>
        <p>{activeCase.summary}</p>
        {activeCase.markers.length > 0 ? (
          <ul className="pathology-legend">
            {activeCase.markers.map((m) => (
              <li key={m.label}>
                <span className="pathology-swatch" style={{ background: m.color }} aria-hidden />
                {m.label}
              </li>
            ))}
          </ul>
        ) : (
          <p className="small muted">No pathology overlay on the reference view.</p>
        )}
        <p className="small muted">
          Pair with <Link to="/app/student/read">Reading</Link>,{' '}
          <Link to="/app/student/image-lab">Image lab</Link>, and{' '}
          <Link to="/app/student/cv-lab">CV lab</Link> for the same lesion vocabulary.
        </p>
      </section>

      <section className="card stack">
        <h3>Demo gallery (extra .glb files)</h3>
        <p className="small muted">
          Separate from the bundled default. Quick-load a sample below, or use <strong>Choose file</strong>{' '}
          and browse to <code>{TOOTH_DEMO_GALLERY_FOLDER}</code> on this PC.
        </p>
        <div className="pathology-case-grid">
          {demoSamples.map((sample) => (
            <button
              key={sample.id}
              type="button"
              className="pathology-case"
              onClick={() => loadDemoSample(sample.url, sample.label)}
            >
              {sample.label}
            </button>
          ))}
        </div>
        <ul className="pathology-legend">
          {demoSamples.map((sample) => (
            <li key={`${sample.id}-note`}>
              <strong>{sample.label}:</strong> {sample.note}
            </li>
          ))}
        </ul>
      </section>

      <div className="card stack">
        <label className="field">
          <span>Upload 3D model (.glb) — optional</span>
          <input type="file" accept=".glb,model/gltf-binary" onChange={onPickFile} />
        </label>
        <div className="row-actions">
          <button type="button" className="btn primary" onClick={useProjectDefault}>
            Use project default (single tooth)
          </button>
          {isUploaded && (
            <span className="small muted">
              Upload active — use the button above for the bundled single tooth model.
            </span>
          )}
        </div>
        <p className="small muted">
          <strong>Viewer source:</strong> {sourceSummary}
        </p>
        <p className="small muted">
          URL: <code style={{ wordBreak: 'break-all' }}>{src}</code>
        </p>
      </div>

      <div className="card glb-viewer-card">
        <GlbViewer
          key={`${viewerKey}-${caseId}-${src}`}
          url={src}
          markers={activeCase.markers}
          onLoad={() => setViewerHint(null)}
          onError={(msg) => {
            if (src.startsWith('blob:')) {
              setViewerHint(
                `Could not load upload (${uploadFileName ?? 'file'}): ${msg}. Try Use project default or a Blender-exported GLB.`,
              )
              return
            }
            if (src === bundledModel) {
              setViewerHint(
                `Bundled tooth model failed (${msg}). Trying online fallback model. Check that public/models/single_tooth.glb exists.`,
              )
              setSrc(FALLBACK_GLb)
              setViewerKey((k) => k + 1)
              return
            }
            setViewerHint(`Load error: ${msg}`)
          }}
        />
      </div>

      <section className="card prose">
        <h3>How to use</h3>
        <ul>
          <li>Switch scenarios to compare cystic versus tumor-style expansion patterns in 3D.</li>
          <li>Drag to orbit, scroll / pinch to zoom. Overlays rescale to the loaded mesh bounds.</li>
          <li>
            Demo-only meshes live in <code>{TOOTH_DEMO_GALLERY_FOLDER}</code> — use gallery buttons or
            Choose file during a presentation.
          </li>
        </ul>
      </section>
    </div>
  )
}
