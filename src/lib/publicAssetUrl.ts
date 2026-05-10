/**
 * Resolve paths from `public/` for runtime fetch & model-viewer `src`.
 * With Vite `base: './'`, string concatenation like `./models/x` breaks on deep client
 * routes (e.g. /app/student/models → wrong folder).
 */
export function publicAssetUrl(path: string): string {
  const p = path.replace(/^\//, '')
  const envBase = import.meta.env.BASE_URL

  if (envBase === './' || envBase === '.') {
    if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
      return `${window.location.origin}/${p}`
    }
    return new URL(p, window.location.href).href
  }

  const base = envBase.endsWith('/') ? envBase : `${envBase}/`
  if (base.startsWith('/')) {
    return `${window.location.origin}${base}${p}`
  }
  return new URL(`${base}${p}`, window.location.href).href
}
