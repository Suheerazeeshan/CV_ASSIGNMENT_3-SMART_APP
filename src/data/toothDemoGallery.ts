export type ToothDemoGlb = {
  id: string
  label: string
  file: string
  note: string
}

/** Extra meshes for live demos — kept separate from the bundled default in `public/models/`. */
export const TOOTH_DEMO_GLB_SAMPLES: ToothDemoGlb[] = [
  {
    id: 'single-tooth',
    label: 'Single tooth',
    file: 'models/demo-gallery/single_tooth.glb',
    note: 'Compact single-tooth mesh.',
  },
  {
    id: 'anatomical',
    label: 'Anatomical tooth model',
    file: 'models/demo-gallery/anatomical_tooth_model.glb',
    note: 'Labeled anatomical export.',
  },
  {
    id: 'realistic-jaw',
    label: 'Realistic tooth / jaw',
    file: 'models/demo-gallery/realistic_tooth_jaw.glb',
    note: 'Larger jaw-style teaching mesh.',
  },
  {
    id: 'realistic-jaw-test',
    label: 'Realistic jaw (test)',
    file: 'models/demo-gallery/realistic_tooth_jaw_test.glb',
    note: 'Alternate jaw export.',
  },
  {
    id: 'realistic-jaw-test-4',
    label: 'Realistic jaw (test 4)',
    file: 'models/demo-gallery/realistic_tooth_jaw_test_4.glb',
    note: 'Copy of realistic_tooth_jaw_test (4).glb.',
  },
  {
    id: 'downloads-tooth',
    label: 'Downloads tooth',
    file: 'models/demo-gallery/downloads_tooth.glb',
    note: 'Extra tooth file from Downloads.',
  },
]

export const TOOTH_DEMO_GALLERY_FOLDER = 'public/models/demo-gallery'
