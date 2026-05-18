/**
 * Resolve paths from `public/` for runtime fetch & `<img src>`.
 * Must always resolve from the site root — not from the current route
 * (e.g. /app/student/ar + ar-samples/foo → 404 HTML).
 */
export function publicAssetUrl(path: string): string {
  const p = path.replace(/^\//, '')

  if (typeof window !== 'undefined') {
    return new URL(p, `${window.location.origin}/`).href
  }

  const base = import.meta.env.BASE_URL ?? '/'
  if (base === './' || base === '.') return `/${p}`
  const normalized = base.endsWith('/') ? base : `${base}/`
  return `${normalized}${p}`.replace(/([^:]\/)\/+/g, '$1')
}
