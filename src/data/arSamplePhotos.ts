export interface ArSamplePhoto {
  id: string
  title: string
  file: string
  description: string
}

/** Files in `public/ar-samples/` — served from site root. */
export const AR_SAMPLE_PHOTOS: ArSamplePhoto[] = [
  {
    id: 'jaw-front',
    title: 'Anterior jaw (front)',
    file: 'jaw-front-anterior.svg',
    description: 'Front view — best match for the on-screen oval overlay.',
  },
  {
    id: 'jaw-occlusal',
    title: 'Occlusal arch',
    file: 'jaw-occlusal-arch.svg',
    description: 'Top-down tooth arch for row alignment practice.',
  },
  {
    id: 'impacted-molar',
    title: 'Impacted crown view',
    file: 'impacted-molar-clinical.svg',
    description: 'Highlights impacted third-molar region (yellow zone).',
  },
  {
    id: 'ridge-model',
    title: 'Alveolar ridge model',
    file: 'edentulous-ridge-model.svg',
    description: 'Ridge model with center marker for spatial alignment.',
  },
]

/** Absolute URL from site root (works on /app/student/ar and every route). */
export function resolveSampleUrl(sample: Pick<ArSamplePhoto, 'file'>): string {
  const file = sample.file.replace(/^\//, '')
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/ar-samples/${file}`
  }
  return `/ar-samples/${file}`
}
