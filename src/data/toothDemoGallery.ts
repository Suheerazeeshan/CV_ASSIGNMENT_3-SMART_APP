export type ToothDemoGlb = {
  id: string
  label: string
  file: string
  note: string
}

/** 3D meshes for live demos — folder: public/models/demo-gallery/ */
export const TOOTH_DEMO_GLB_SAMPLES: ToothDemoGlb[] = [
  {
    id: 'free-teeth-base',
    label: 'Free teeth base mesh (default)',
    file: 'models/demo-gallery/free_teeth_base_mesh.glb',
    note: 'From free-teeth-base-mesh.zip — Teeth_Base_Mesh_Modeling.',
  },
  {
    id: 'rigged-teeth-gums',
    label: 'Rigged teeth with gums',
    file: 'models/demo-gallery/rigged_teeth_with_gums.glb',
    note: 'From rigged-teeth-with-gums.zip.',
  },
  {
    id: 'full-mouth',
    label: 'Full mouth (procedural color)',
    file: 'models/demo-gallery/full_mouth_anatomy_color.glb',
    note: 'Default — both arches with color anatomy.',
  },
  {
    id: 'mandible-anatomy',
    label: 'Lower jaw only',
    file: 'models/demo-gallery/mandible_anatomy_color.glb',
    note: 'Mandible arch — teeth, gums, nerves, vessels.',
  },
  {
    id: 'maxilla-anatomy',
    label: 'Upper jaw only',
    file: 'models/demo-gallery/maxilla_anatomy_color.glb',
    note: 'Maxilla arch — teeth, gums, nerves, vessels.',
  },
  {
    id: 'realistic-jaw',
    label: 'Single molar (legacy)',
    file: 'models/demo-gallery/realistic_tooth_jaw.glb',
    note: 'One procedural molar (filename says jaw).',
  },
  {
    id: 'anatomical',
    label: 'Anatomical tooth model',
    file: 'models/demo-gallery/anatomical_tooth_model.glb',
    note: 'Labeled anatomical export.',
  },
  {
    id: 'single-tooth',
    label: 'Single tooth (sketch)',
    file: 'models/demo-gallery/single_tooth.glb',
    note: 'Simple procedural single tooth.',
  },
  {
    id: 'realistic-jaw-test',
    label: 'Realistic jaw (test)',
    file: 'models/demo-gallery/realistic_tooth_jaw_test.glb',
    note: 'Alternate jaw export.',
  },
  {
    id: 'downloads-tooth',
    label: 'Downloads tooth',
    file: 'models/demo-gallery/downloads_tooth.glb',
    note: 'Extra tooth file from Downloads.',
  },
]

export const TOOTH_DEMO_GALLERY_FOLDER = 'public/models/demo-gallery'
