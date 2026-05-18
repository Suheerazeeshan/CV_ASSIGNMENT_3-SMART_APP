import manifest from './sketchfabImports.json'

export type SketchfabImportModel = {
  id: string
  label: string
  file: string
  note: string
  importedAt?: string
  sketchfabUrl?: string
}

export const SKETCHFAB_IMPORTED_MODELS: SketchfabImportModel[] = manifest.models

export const SKETCHFAB_IMPORT_FOLDER = 'public/models/sketchfab-import'
