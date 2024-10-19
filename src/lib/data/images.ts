import prisma from "@/lib/clients/prisma"

/**
 * Fetches the images of a user.
 * Requires the userId
 */
export const fetchImages = async (userId: string) => {
  const images = await prisma.image.findMany({
    where: { userId },
  })

  return images
}

/**
 * Fetches the image.
 * Requires the image id
 */
export const fetchImageWithId = async (imageId: number) => {
  const image = await prisma.image.findUnique({
    where: { id: Number(imageId) },
  })

  return image
}
