import type { Box3 } from 'three'
import type { Pathology3DMarker } from '../data/pathologyModels3D'

export function markerWorldPosition(
  box: Box3,
  marker: Pick<Pathology3DMarker, 'u' | 'v' | 'w'>,
): [number, number, number] {
  const { min, max } = box
  return [
    min.x + (max.x - min.x) * marker.u,
    min.y + (max.y - min.y) * marker.v,
    min.z + (max.z - min.z) * marker.w,
  ]
}
