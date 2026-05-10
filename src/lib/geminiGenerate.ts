/**
 * Shared Gemini REST helper (browser). Uses x-goog-api-key header and model fallbacks.
 */

type GeminiApiShape = {
  candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[]
  promptFeedback?: { blockReason?: string }
}

/** Prefer 1.5 Flash first — often has separate free-tier limits when 2.0 is rate-limited. */
const MODEL_CANDIDATES = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-2.0-flash',
  'gemini-2.5-flash',
]

export function getGeminiApiKey(): string | undefined {
  const k = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
  const t = k?.trim()
  return t || undefined
}

function parseErrorBody(status: number, raw: string): string {
  try {
    const j = JSON.parse(raw) as { error?: { message?: string } }
    if (j.error?.message) return `HTTP ${status}: ${j.error.message}`
  } catch {
    /* ignore */
  }
  return `HTTP ${status}: ${raw.slice(0, 280)}${raw.length > 280 ? '…' : ''}`
}

export type GeminiGenerateResult =
  | { ok: true; text: string }
  | { ok: false; message: string }

export async function generateGeminiContent(body: Record<string, unknown>): Promise<GeminiGenerateResult> {
  const key = getGeminiApiKey()
  if (!key) {
    return {
      ok: false,
      message:
        'No API key in this build. Create oral-pathology-edu/.env with VITE_GEMINI_API_KEY=… then stop and run npm run dev again (Vite only reads .env at startup).',
    }
  }

  let lastMessage = ''
  for (const model of MODEL_CANDIDATES) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': key,
        },
        body: JSON.stringify(body),
      })
      const raw = await res.text()

      if (!res.ok) {
        lastMessage = parseErrorBody(res.status, raw)
        // Unknown model / bad request → try next. 429/503 → try next model (separate quotas).
        if (
          res.status === 400 ||
          res.status === 404 ||
          res.status === 429 ||
          res.status === 503
        ) {
          continue
        }
        return { ok: false, message: lastMessage }
      }

      let data: GeminiApiShape
      try {
        data = JSON.parse(raw) as GeminiApiShape
      } catch {
        lastMessage = 'Invalid JSON from Gemini.'
        continue
      }

      const block = data.promptFeedback?.blockReason
      if (block) {
        return {
          ok: false,
          message: `Request blocked (${block}). Try another crop or a less sensitive image for class demos.`,
        }
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (text?.trim()) return { ok: true, text }

      const finish = data.candidates?.[0]?.finishReason
      lastMessage = finish
        ? `No text returned (finishReason: ${finish}).`
        : 'No candidate text (empty response).'
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      return {
        ok: false,
        message: `Network error: ${msg}. Check connectivity, firewall, or browser extensions blocking Google APIs.`,
      }
    }
  }

  const base =
    lastMessage ||
    'Could not reach Gemini with any fallback model. Confirm the Generative Language API is enabled for your key and quota is available.'

  if (/429|quota|rate limit|free_tier/i.test(base)) {
    return {
      ok: false,
      message:
        `${base}\n\n` +
        'If every model is rate-limited: wait 1–2 minutes and try again; check usage at https://ai.dev/rate-limit ; ' +
        'in Google AI / Cloud Console enable billing or raise quotas if your project shows limit 0 on free tier.',
    }
  }

  return { ok: false, message: base }
}
