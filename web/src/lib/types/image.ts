export type ImageType = {
  id: number
  imageUrl: string | null
  metadata: JSON
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface Transformations {
  resize: number
  // crop: { x: number; y: number; width: number; height: number }
  rotate: number
  watermark: string
  flip: boolean
  mirror: boolean
  compress: number
  format: string
  filter: string
}
