import { useEffect, useRef, useState } from 'react'

export function ArLab() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [ori, setOri] = useState({ beta: 0, gamma: 0 })

  useEffect(() => {
    const onOri = (e: DeviceOrientationEvent) => {
      setOri({ beta: e.beta ?? 0, gamma: e.gamma ?? 0 })
    }
    window.addEventListener('deviceorientation', onOri)
    return () => window.removeEventListener('deviceorientation', onOri)
  }, [])

  async function start() {
    const s = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false,
    })
    setStream(s)
    if (videoRef.current) {
      videoRef.current.srcObject = s
      await videoRef.current.play()
    }
  }

  function stop() {
    stream?.getTracks().forEach((t) => t.stop())
    setStream(null)
    if (videoRef.current) videoRef.current.srcObject = null
  }

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [stream])

  const tiltX = Math.max(-18, Math.min(18, ori.gamma))
  const tiltY = Math.max(-12, Math.min(12, (ori.beta ?? 0) - 45))

  return (
    <div className="page">
      <h2>AR-style preparation lab</h2>
      <p className="muted">
        Grant camera access. Align a printed jaw sketch or dental model; labels shift gently with
        device tilt when orientation events are available (mobile browsers).
      </p>
      <div className="ar-stage card">
        <video ref={videoRef} className="ar-video" playsInline muted />
        {!stream && (
          <div className="ar-placeholder">
            <p>Camera preview idle</p>
            <button type="button" className="btn primary" onClick={start}>
              Start camera
            </button>
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
      {stream && (
        <button type="button" className="btn ghost" onClick={stop}>
          Stop camera
        </button>
      )}
    </div>
  )
}
