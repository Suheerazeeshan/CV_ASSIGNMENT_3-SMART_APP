import { useState, type FormEvent } from 'react'

/** Lightweight visual drill tying CV-style reasoning to pathology concepts. */
export function ImageLab() {
  const [choice, setChoice] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  function submit(e: FormEvent) {
    e.preventDefault()
    setRevealed(true)
  }

  const ok = choice === 1

  return (
    <div className="page">
      <h2>Image identification lab</h2>
      <p className="muted">
        Interpret simplified schematic “regions” as you would with annotated clinical imaging modules.
      </p>
      <div className="card image-lab">
        <svg viewBox="0 0 320 200" role="img" aria-labelledby="imglab-title">
          <title id="imglab-title">Schematic jaw with highlighted regions</title>
          <rect width="320" height="200" fill="#0f172a" rx="12" />
          <path
            d="M40 120 Q160 40 280 120 Q160 170 40 120"
            fill="#1e293b"
            stroke="#38bdf8"
            strokeWidth="2"
          />
          <circle cx="210" cy="95" r="28" fill="rgba(248,113,113,0.35)" stroke="#f87171" />
          <circle cx="110" cy="115" r="22" fill="rgba(74,222,128,0.25)" stroke="#4ade80" />
          <text x="190" y="55" fill="#e2e8f0" fontSize="11">
            Red: focal zone · Green: reference cortex
          </text>
        </svg>
        <form className="stack" onSubmit={submit}>
          <p>
            <strong>Question:</strong> The red-highlighted zone most likely corresponds to which
            educational emphasis in odontogenic pathology labs?
          </p>
          <label className="opt">
            <input
              type="radio"
              name="cv"
              checked={choice === 0}
              onChange={() => setChoice(0)}
            />
            Benign fibrous enlargement unrelated to tooth germ epithelium
          </label>
          <label className="opt">
            <input
              type="radio"
              name="cv"
              checked={choice === 1}
              onChange={() => setChoice(1)}
            />
            Crown-adjacent developmental cystic area around an impacted tooth
          </label>
          <label className="opt">
            <input
              type="radio"
              name="cv"
              checked={choice === 2}
              onChange={() => setChoice(2)}
            />
            Salivary gland duct calculus shadowing
          </label>
          <button className="btn primary" type="submit" disabled={choice === null}>
            Reveal rationale
          </button>
          {revealed && (
            <p className={ok ? 'success' : 'error'}>
              {ok
                ? 'Correct: focal pericoronal emphasis matches dentigerous-type teaching overlays.'
                : 'Review dentigerous cyst anatomy versus inflammatory radicular disease.'}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
