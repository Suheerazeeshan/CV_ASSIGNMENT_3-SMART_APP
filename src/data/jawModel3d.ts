import defaultJawGlb from '../assets/models/free_teeth_base_mesh.glb?url'

/** Default: free teeth base mesh from free-teeth-base-mesh.zip */
export const DEFAULT_JAW_GLB_URL = defaultJawGlb

export const JAW_GLB_VARIANTS = {
  freeTeethBase: 'models/demo-gallery/free_teeth_base_mesh.glb',
  fullMouth: 'models/demo-gallery/full_mouth_anatomy_color.glb',
  lower: 'models/demo-gallery/mandible_anatomy_color.glb',
  upper: 'models/demo-gallery/maxilla_anatomy_color.glb',
} as const

/** Anatomy color legend shown beside the 3D viewer. */
export const JAW_ANATOMY_LEGEND = [
  { label: 'Teeth (enamel)', color: '#fffaf5' },
  { label: 'Gums (gingiva)', color: '#e06b6b' },
  { label: 'Nerves', color: '#ffe033' },
  { label: 'Arteries', color: '#e82222' },
  { label: 'Veins', color: '#2a4fd4' },
  { label: 'Jaw bone (translucent)', color: 'rgba(255, 246, 238, 0.55)' },
] as const
