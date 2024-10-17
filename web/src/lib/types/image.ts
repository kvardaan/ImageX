export type Image = {
  id: number
  imageUrl: string | null
  metadata: JSON | null
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
