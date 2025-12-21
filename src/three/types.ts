import type { Group } from 'three'

export interface LoadedModel {
  scene: Group
  animations: any[]
  url: string
}

export type ModelLoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface ModelLoaderOptions {
  onProgress?: (progress: number) => void
  onError?: (error: Error) => void
}
