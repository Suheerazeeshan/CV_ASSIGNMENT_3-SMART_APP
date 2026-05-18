import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AR_SAMPLE_PHOTOS,
  resolveSampleUrl,
  type ArSamplePhoto,
} from '../../data/arSamplePhotos'
type SourceMode = 'photo' | 'camera'

function cameraSupportMessage(): string | null {
  if (!window.isSecureContext) {
    return 'Camera access on phones needs HTTPS or localhost. Open the app with https:// on your Wi-Fi address, accept the browser security warning, then try again.'
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    return 'This browser does not expose camera access here. Try Chrome or Safari on your phone.'
  }
  return null
}

export function ArLab() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [mode, setMode] = useState<SourceMode>('photo')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [photoIsBlob, setPhotoIsBlob] = useState(false)
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null)
  const samples = AR_SAMPLE_PHOTOS
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [starting, setStarting] = useState(false)
  const [ori, setOri] = useState({ beta: 0, gamma: 0 })
  const jawSketchSrc = useMemo(
    () => `${window.location.origin}/ar-jaw-sketch.svg`,
    [],
  )

  useEffect(() => {
    const onOri = (e: DeviceOrientationEvent) => {
      setOri({ beta: e.beta ?? 0, gamma: e.gamma ?? 0 })
    }
    window.addEventListener('deviceorientation', onOri)
    return () => window.removeEventListener('deviceorientation', onOri)
  }, [])

  function clearPhoto() {
    if (photoIsBlob && photoUrl) URL.revokeObjectURL(photoUrl)
    setPhotoUrl(null)
    setPhotoIsBlob(false)
    setSelectedSampleId(null)
  }

  function stopCamera() {
    stream?.getTracks().forEach((t) => t.stop())
    setStream(null)
    if (videoRef.current) videoRef.current.srcObject = null
  }

  function switchMode(next: SourceMode) {
    setCameraError(null)
    if (next === 'photo') stopCamera()
    if (next === 'camera') clearPhoto()
    setMode(next)
  }

  function selectSample(sample: ArSamplePhoto) {
    setCameraError(null)
    stopCamera()
    if (photoIsBlob && photoUrl) URL.revokeObjectURL(photoUrl)
    setPhotoUrl(resolveSampleUrl(sample))
    setPhotoIsBlob(false)
    setSelectedSampleId(sample.id)
  }

  useEffect(() => {
    if (mode === 'photo' && !photoUrl && samples.length > 0) {
      selectSample(samples[0])
    }
    // Load default sample once on open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onPhotoSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setCameraError('Please choose an image file (JPEG, PNG, etc.).')
      e.target.value = ''
      return
    }
    setCameraError(null)
    stopCamera()
    clearPhoto()
    setPhotoUrl(URL.createObjectURL(file))
    setPhotoIsBlob(true)
    setSelectedSampleId(null)
    e.target.value = ''
  }

  async function startCamera() {
    const supportMessage = cameraSupportMessage()
    if (supportMessage) {
      setCameraError(supportMessage)
      return
    }

    setStarting(true)
    setCameraError(null)
    clearPhoto()

    try {
      let mediaStream: MediaStream
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        })
      } catch {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        })
      }

      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
      }
    } catch (error) {
      const denied =
        error instanceof DOMException &&
        (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError')

      setCameraError(
        denied
          ? 'Camera permission was blocked. Allow camera access for this site in phone settings, then reload and tap Start camera again.'
          : 'Camera could not start. Use HTTPS on the same Wi-Fi, allow camera permission, and avoid in-app browsers such as WhatsApp.',
      )
    } finally {
      setStarting(false)
    }
  }

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [stream])

  useEffect(() => {
    return () => {
      if (photoIsBlob && photoUrl) URL.revokeObjectURL(photoUrl)
    }
  }, [photoUrl, photoIsBlob])

  const tiltX = Math.max(-18, Math.min(18, ori.gamma))
  const tiltY = Math.max(-12, Math.min(12, (ori.beta ?? 0) - 45))
  const hasBackground = mode === 'photo' ? !!photoUrl : !!stream

  return (
    <div className="page">
      <h2>AR-style preparation lab</h2>
      <p className="muted">
        Pick a sample from the app folder, upload your own image, or use the live camera. The jaw
        guide and study labels stay on top for alignment practice.
      </p>

      <div className="ar-mode-tabs" role="tablist" aria-label="Background source">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'photo'}
          className={'ar-mode-tab' + (mode === 'photo' ? ' ar-mode-tab-active' : '')}
          onClick={() => switchMode('photo')}
        >
          Photo mode
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'camera'}
          className={'ar-mode-tab' + (mode === 'camera' ? ' ar-mode-tab-active' : '')}
          onClick={() => switchMode('camera')}
        >
          Live camera
        </button>
      </div>

      {mode === 'photo' && (
        <section className="ar-sample-panel card" aria-label="Sample images from app folder">
          <h3 className="ar-sample-heading">Sample images from app folder</h3>
          <p className="muted small">
            Tap a sample to load it under the jaw guide. Images are bundled with the app for reliable
            loading on every page.
          </p>
          <ul className="ar-sample-grid">
            {samples.map((sample) => (
              <li key={sample.id}>
                <button
                  type="button"
                  className={
                    'ar-sample-card' +
                    (selectedSampleId === sample.id ? ' ar-sample-card-active' : '')
                  }
                  onClick={() => selectSample(sample)}
                >
                  <img
                    src={resolveSampleUrl(sample)}
                    alt=""
                    className="ar-sample-thumb"
                  />
                  <span className="ar-sample-title">{sample.title}</span>
                  <span className="ar-sample-desc muted small">{sample.description}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="ar-ref-badge" role="status">
        On-screen jaw guide active
      </p>

      {cameraError && <p className="error">{cameraError}</p>}

      <div className="ar-stage card">
        {mode === 'camera' && (
          <video
            ref={videoRef}
            className={'ar-video' + (stream ? '' : ' ar-video-hidden')}
            playsInline
            muted
          />
        )}
        {mode === 'photo' && photoUrl && (
          <img src={photoUrl} alt="Selected jaw reference" className="ar-photo-bg" />
        )}
        <img src={jawSketchSrc} alt="" className="ar-reference" aria-hidden />
        {!hasBackground && (
          <div className="ar-placeholder">
            {mode === 'photo' ? (
              <>
                <p>Pick a sample above or upload from your device</p>
                <button type="button" className="btn primary" onClick={() => fileRef.current?.click()}>
                  Upload image
                </button>
              </>
            ) : (
              <>
                <p>Camera preview idle</p>
                <button
                  type="button"
                  className="btn primary"
                  onClick={startCamera}
                  disabled={starting}
                >
                  {starting ? 'Starting camera…' : 'Start camera'}
                </button>
              </>
            )}
          </div>
        )}
        <svg className="ar-overlay" viewBox="0 0 400 240" aria-hidden>
          <g
            style={{
              transform: `translate(${tiltX}px, ${tiltY}px)`,
              transition: 'transform 120ms linear',
            }}
          >
            <ellipse cx="200" cy="130" rx="120" ry="70" fill="rgba(14,165,233,0.15)" stroke="#0ea5e9" />
            <text x="120" y="88" fill="#e0f2fe" fontSize="12">
              Lesion watch zone
            </text>
            <text x="230" y="170" fill="#fef08a" fontSize="12">
              Impacted crown area
            </text>
          </g>
        </svg>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="ar-file-input"
        onChange={onPhotoSelected}
      />

      <div className="row-actions wrap ar-actions">
        {mode === 'photo' && (
          <>
            <button type="button" className="btn secondary" onClick={() => fileRef.current?.click()}>
              Upload from device
            </button>
            {photoUrl && (
              <button type="button" className="btn ghost" onClick={clearPhoto}>
                Clear image
              </button>
            )}
          </>
        )}
        {mode === 'camera' && stream && (
          <button type="button" className="btn ghost" onClick={stopCamera}>
            Stop camera
          </button>
        )}
      </div>
    </div>
  )
}
