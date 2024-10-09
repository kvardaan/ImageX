export type Image = {
  id: number;
  imageUrl: string | null;
  metadata: JSON;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}