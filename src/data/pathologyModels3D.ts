export type Pathology3DMarker = {
  label: string
  /** 0 = min, 1 = max along each axis of the loaded model bounds. */
  u: number
  v: number
  w: number
  /** Fraction of the model's largest dimension. */
  radiusScale: number
  color: string
  scale?: [number, number, number]
}

export type Pathology3DCase = {
  id: string
  name: string
  category: 'cyst' | 'tumor' | 'reference'
  summary: string
  imagingCue: string
  markers: Pathology3DMarker[]
}

export const PATHOLOGY_3D_CASES: Pathology3DCase[] = [
  {
    id: 'healthy',
    name: 'Healthy tooth reference',
    category: 'reference',
    summary:
      'Baseline crown, root, and cervical anatomy without a pathologic cavity or cortical expansion.',
    imagingCue: 'Use this view to compare crown height, root taper, and cervical contour before overlays.',
    markers: [],
  },
  {
    id: 'radicular-cyst',
    name: 'Radicular (periapical) cyst',
    category: 'cyst',
    summary:
      'Inflammatory odontogenic cyst classically linked to a non-vital tooth, with expansion at the root apex.',
    imagingCue:
      'Teaching overlay: periapical radiolucency centered on the apex of the compromised root.',
    markers: [
      {
        label: 'Periapical radiolucency',
        u: 0.5,
        v: 0.1,
        w: 0.5,
        radiusScale: 0.22,
        color: '#f87171',
        scale: [1, 1.15, 1],
      },
    ],
  },
  {
    id: 'dentigerous-cyst',
    name: 'Dentigerous cyst',
    category: 'cyst',
    summary:
      'Developmental cyst that envelops the crown of an unerupted or impacted tooth and expands in a follicular pattern.',
    imagingCue:
      'Teaching overlay: pericoronal radiolucency hugging the crown rather than strictly the root apex.',
    markers: [
      {
        label: 'Pericoronal follicular space',
        u: 0.52,
        v: 0.88,
        w: 0.5,
        radiusScale: 0.28,
        color: '#38bdf8',
        scale: [1.25, 0.75, 1.25],
      },
    ],
  },
  {
    id: 'okc',
    name: 'Keratocystic odontogenic lesion (OKC)',
    category: 'cyst',
    summary:
      'Odontogenic lesion with aggressive behavior and recurrence risk compared with many simple cysts.',
    imagingCue:
      'Teaching overlay: multilocular radiolucent regions along the posterior mandible with cortical thinning.',
    markers: [
      {
        label: 'Anterior locule',
        u: 0.38,
        v: 0.48,
        w: 0.42,
        radiusScale: 0.18,
        color: '#a78bfa',
      },
      {
        label: 'Posterior locule',
        u: 0.62,
        v: 0.44,
        w: 0.58,
        radiusScale: 0.2,
        color: '#c4b5fd',
      },
      {
        label: 'Cortical expansion',
        u: 0.78,
        v: 0.5,
        w: 0.5,
        radiusScale: 0.14,
        color: '#fbbf24',
        scale: [0.55, 1, 1.35],
      },
    ],
  },
  {
    id: 'ameloblastoma',
    name: 'Ameloblastoma',
    category: 'tumor',
    summary:
      'Benign but locally invasive odontogenic epithelial tumor that often expands the mandibular cortex.',
    imagingCue:
      'Teaching overlay: multilocular soap-bubble expansion with cortical breach in the posterior jaw.',
    markers: [
      {
        label: 'Tumor body',
        u: 0.55,
        v: 0.46,
        w: 0.5,
        radiusScale: 0.3,
        color: '#fb923c',
        scale: [1.35, 1, 1.15],
      },
      {
        label: 'Cortical breach',
        u: 0.82,
        v: 0.42,
        w: 0.52,
        radiusScale: 0.12,
        color: '#f97316',
        scale: [0.45, 0.9, 1.4],
      },
    ],
  },
]
