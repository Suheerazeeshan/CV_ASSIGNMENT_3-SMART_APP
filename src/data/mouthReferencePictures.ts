export type MouthReferencePicture = {
  id: string
  label: string
  file: string
  note: string
}

/** 2D colored anatomy references (Sketchfab-style teaching art). Folder: public/models/mouth-reference-pictures/ */
export const MOUTH_REFERENCE_PICTURES: MouthReferencePicture[] = [
  {
    id: 'full-mouth',
    label: 'Full mouth (upper + lower)',
    file: 'models/mouth-reference-pictures/full-mouth-anatomy-color.svg',
    note: 'Both arches with teeth, gums, nerves, and vessels.',
  },
  {
    id: 'lower-jaw',
    label: 'Lower jaw only',
    file: 'models/mouth-reference-pictures/lower-jaw-anatomy-color.svg',
    note: 'Mandible with inferior alveolar nerve and vessels.',
  },
  {
    id: 'upper-jaw',
    label: 'Upper jaw only',
    file: 'models/mouth-reference-pictures/upper-jaw-anatomy-color.svg',
    note: 'Maxilla with superior alveolar supply.',
  },
  {
    id: 'occlusal',
    label: 'Occlusal (top view)',
    file: 'models/mouth-reference-pictures/occlusal-full-mouth-color.svg',
    note: 'Bird’s-eye view of upper and lower arches.',
  },
]

export const MOUTH_REFERENCE_FOLDER = 'public/models/mouth-reference-pictures'
