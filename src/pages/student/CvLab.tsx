import { useCallback, useRef, useState } from 'react'
import {
  boxBlur,
  cloneCanvas,
  edgeDensity,
  fitCanvasToImage,
  meanBrightness,
  putImageData,
  sobelMagnitude,
  toGrayscale,
} from '../../lib/cvPipeline'
import { getGeminiApiKey } from '../../lib/geminiGenerate'
import { geminiDescribeImage } from '../../lib/geminiVision'

type Step = 'original' | 'gray' | 'blur' | 'edges'

export function CvLab() {
  const origCanvasRef = useRef<HTMLCanvasElement>(null)
  const procCanvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>('original')
  const [metrics, setMetrics] = useState({ mean: 0, edge: 0 })
  const [busy, setBusy] = useState(false)
  const [aiText, setAiText] = useState<string | null>(null)
  const [mime, setMime] = useState<string | null>(null)
  const [b64, setB64] = useState<string | null>(null)

  const applyPipeline = useCallback((targetStep: Step) => {
    const orig = origCanvasRef.current
    const proc = procCanvasRef.current
    if (!orig || !proc || orig.width === 0) return

    proc.width = orig.width
    proc.height = orig.height

    let data = cloneCanvas(orig)
    if (targetStep === 'original') {
      putImageData(proc, data)
      setMetrics({
        mean: meanBrightness(data),
        edge: 0,
      })
      return
    }

    data = toGrayscale(data)
    if (targetStep === 'gray') {
      putImageData(proc, data)
      setMetrics({ mean: meanBrightness(data), edge: 0 })
      return
    }

    data = boxBlur(data, 2)
    if (targetStep === 'blur') {
      putImageData(proc, data)
      setMetrics({ mean: meanBrightness(data), edge: 0 })
      return
    }

    const edges = sobelMagnitude(data)
    putImageData(proc, edges)
    setMetrics({
      mean: meanBrightness(edges),
      edge: edgeDensity(edges, 90),
    })
  }, [])

  function onFile(file: File) {
    setAiText(null)
    setMime(file.type || 'image/jpeg')
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const c = origCanvasRef.current
        if (!c) return
        fitCanvasToImage(img, c, 760)
        const p = procCanvasRef.current
        if (p) {
          p.width = c.width
          p.height = c.height
        }
        setStep('original')
        applyPipeline('original')

        const fr = new FileReader()
        fr.onload = () => {
          const res = fr.result as string
          const idx = res.indexOf(',')
          setB64(idx >= 0 ? res.slice(idx + 1) : null)
        }
        fr.readAsDataURL(file)
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  async function runGemini() {
    if (!b64 || !mime) return
    setBusy(true)
    setAiText(null)
    const prompt =
      'You assist dental students studying odontogenic oral pathology. Describe notable visual ' +
      'patterns (texture, contrast, edges, suspected lesion margins) and safe educational next ' +
      'steps. Avoid definitive diagnosis; emphasize imaging histology correlation.'
    try {
      const message = await geminiDescribeImage(mime, b64, prompt)
      setAiText(message)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setAiText(
        `Gemini request failed: ${msg}. If the key is set, hard-refresh the page (Ctrl+Shift+R) ` +
          'to clear an old bundle.',
      )
    } finally {
      setBusy(false)
    }
  }

  function runStep(next: Step) {
    setStep(next)
    applyPipeline(next)
  }

  return (
    <div className="page">
      <h2>Computer vision lab</h2>
      <p className="muted">
        Upload a histology photo, clinical intra-oral image, or diagram. This page runs a classical
        CV pipeline in the browser (grayscale → blur → Sobel edges) and reports simple radiometric /
        edge-density metrics—typical precursors before deep learning in lecture demos.
      </p>

      <div className="card stack">
        <label className="field">
          <span>Image file</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onFile(f)
            }}
          />
        </label>
        <div className="row-actions wrap">
          <button type="button" className="btn secondary" onClick={() => runStep('original')}>
            Original
          </button>
          <button type="button" className="btn secondary" onClick={() => runStep('gray')}>
            Grayscale
          </button>
          <button type="button" className="btn secondary" onClick={() => runStep('blur')}>
            Blur
          </button>
          <button type="button" className="btn secondary" onClick={() => runStep('edges')}>
            Sobel edges
          </button>
          <button type="button" className="btn primary" disabled={!b64 || busy} onClick={runGemini}>
            AI describe (Gemini vision)
          </button>
        </div>
        <p className="small muted">
          Gemini client key:{' '}
          {getGeminiApiKey() ? (
            <strong>loaded</strong>
          ) : (
            <>
              <strong>missing</strong> — local: <code>.env</code> + restart <code>npm run dev</code>.
              Live site: add <code>VITE_GEMINI_API_KEY</code> in Netlify env vars (Build scope), then
              redeploy with cache clear.
            </>
          )}
        </p>
        <p className="small muted">
          Step: <strong>{step}</strong> · mean intensity ≈ <strong>{metrics.mean.toFixed(1)}</strong>
          {step === 'edges' ? (
            <>
              {' '}
              · edge density ≈ <strong>{(metrics.edge * 100).toFixed(2)}%</strong>
            </>
          ) : null}
        </p>
      </div>

      <div className="cv-grid">
        <figure className="card">
          <figcaption>Source</figcaption>
          <canvas ref={origCanvasRef} className="cv-canvas" />
        </figure>
        <figure className="card">
          <figcaption>Processed</figcaption>
          <canvas ref={procCanvasRef} className="cv-canvas" />
        </figure>
      </div>

      <section className="card prose">
        <h3>How this maps to lecture CV topics</h3>
        <ul>
          <li>
            <strong>Pre-processing:</strong> grayscale reduces channels; blur suppresses sensor noise
            before derivative filters.
          </li>
          <li>
            <strong>Sobel:</strong> gradient magnitude highlights boundaries—useful when discussing
            lesion interfaces in microscopy crops (still not a classifier).
          </li>
        </ul>
      </section>

      {aiText && (
        <section className="card prose">
          <h3>AI-assisted commentary</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{aiText}</p>
        </section>
      )}
    </div>
  )
}
