import type { HTMLAttributes } from 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': HTMLAttributes<HTMLElement> & {
        src?: string
        alt?: string
        poster?: string
        loading?: string
        exposure?: string
        'camera-target'?: string
        'camera-orbit'?: string
        'camera-controls'?: boolean | string
        'touch-action'?: string
        'shadow-intensity'?: string
        'environment-image'?: string | undefined
        'interaction-prompt'?: string
      }
    }
  }
}

export {}
