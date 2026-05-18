import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { GlbViewer } from '../../components/GlbViewer'
import { DEFAULT_JAW_GLB_URL, JAW_ANATOMY_LEGEND } from '../../data/jawModel3d'
import { PATHOLOGY_3D_CASES } from '../../data/pathologyModels3D'
import { TOOTH_DEMO_GALLERY_FOLDER, TOOTH_DEMO_GLB_SAMPLES } from '../../data/toothDemoGallery'
import { publicAssetUrl } from '../../lib/publicAssetUrl'
import { validateBinaryGlb } from '../../lib/validateGlb'

const GLB_ACCEPT = '.glb,model/gltf-binary'

export function Models3D() {
  const [src, setSrc] = useState(DEFAULT_JAW_GLB_URL)
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

  async function onPickGlb(e: React.ChangeEvent<HTMLInputElement>) {
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

  function useFullMouthDefault() {
    revokeBlob()
    setGalleryLabel(null)
    setSrc(DEFAULT_JAW_GLB_URL)
    setViewerKey((k) => k + 1)
    setViewerHint(null)
  }

  const isUploaded = src.startsWith('blob:')
  const isDefaultJaw = src === DEFAULT_JAW_GLB_URL

  const sourceSummary = isUploaded
    ? `3D upload${uploadFileName ? `: ${uploadFileName}` : ''}`
    : galleryLabel
      ? `3D gallery: ${galleryLabel}`
      : isDefaultJaw
        ? '3D: Free teeth base mesh'
        : '3D: Custom model'

  return (
    <div className="page">
      <h2>3D models</h2>
      <p className="muted">
        Orbit and zoom colorful dental meshes. Pick a model below, or upload your own <strong>.glb</strong>{' '}
        file.
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
        <h3>3D models (gallery)</h3>
        <p className="small muted">
          Click a name to load that mesh in the viewer below. Files live in{' '}
          <code>{TOOTH_DEMO_GALLERY_FOLDER}</code>.
        </p>
        <div className="pathology-case-grid">
          <button
            type="button"
            className={isDefaultJaw ? 'pathology-case active' : 'pathology-case'}
            onClick={useFullMouthDefault}
          >
            Free teeth base (default)
          </button>
          {demoSamples.map((sample) => (
            <button
              key={sample.id}
              type="button"
              className={
                galleryLabel === sample.label && !isUploaded ? 'pathology-case active' : 'pathology-case'
              }
              onClick={() => loadDemoSample(sample.url, sample.label)}
            >
              {sample.label}
            </button>
          ))}
        </div>
      </section>

      <div className="card stack">
        <label className="field">
          <span>Upload 3D model (.glb) — optional</span>
          <input type="file" accept={GLB_ACCEPT} onChange={onPickGlb} />
        </label>
        <div className="row-actions">
          <button type="button" className="btn primary" onClick={useFullMouthDefault}>
            Reset to default teeth model
          </button>
        </div>
        <p className="small muted">
          <strong>3D source:</strong> {sourceSummary}
        </p>
      </div>

      <section className="card stack">
        <h3>Anatomy colors</h3>
        <ul className="pathology-legend">
          {JAW_ANATOMY_LEGEND.map((item) => (
            <li key={item.label}>
              <span className="pathology-swatch" style={{ background: item.color }} aria-hidden />
              {item.label}
            </li>
          ))}
        </ul>
      </section>

      <div className="card glb-viewer-card glb-viewer-card--interactive">
        <p className="glb-viewer-hint small muted">
          <strong>Drag</strong> to move left/right · <strong>Right-drag</strong> to rotate ·{' '}
          <strong>Scroll</strong> to zoom
        </p>
        <GlbViewer
          key={`${viewerKey}-${caseId}-${src}`}
          url={src}
          markers={activeCase.markers}
          onLoad={() => setViewerHint(null)}
          onError={(msg) => {
            if (src.startsWith('blob:')) {
              setViewerHint(
                `Could not load upload (${uploadFileName ?? 'file'}): ${msg}. Try Reset to default teeth model.`,
              )
              return
            }
            if (src === DEFAULT_JAW_GLB_URL) {
              setViewerHint(
                `3D model failed (${msg}). Run npm run import-teeth-zip or check src/assets/models/free_teeth_base_mesh.glb.`,
              )
              return
            }
            setViewerHint(`3D load error: ${msg}`)
          }}
        />
      </div>

      <section className="card prose">
        <h3>How to use</h3>
        <ul>
          <li>
            <strong>Drag</strong> the 3D model to move it left, right, up, or down. <strong>Right-drag</strong>{' '}
            to rotate. <strong>Scroll</strong> to zoom.
          </li>
          <li>Pick a model name in the gallery to switch meshes.</li>
          <li>Switch pathology scenarios to compare cystic versus tumor-style expansion in 3D.</li>
        </ul>
      </section>
    </div>
  )
}
