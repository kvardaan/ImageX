"use server"

import sharp from "sharp"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { StatusCodes } from "http-status-codes"

import {
  getFileNameWithFileType,
  computeSHA256,
  getPublicUrl,
  extractPathFromUrl,
} from "@/lib/utils"
import { auth } from "@/lib/auth"
import prisma from "@/lib/clients/prisma"
import { config } from "@/lib/utils/config"
import { Transformations } from "@/lib/types/image"
import { deleteObject, getSignedPutUrl } from "@/lib/clients/aws.S3"

export async function addImage(formData: FormData) {
  const session = await auth()

  const imageFile = formData.get("file") as File
  const fileName = getFileNameWithFileType(
    formData.get("fileName") as string,
    imageFile.type
  )

  try {
    const putUrl = await getSignedPutUrl({
      bucketName: config.awsS3UserBucketName!,
      fileName: fileName,
      fileSize: imageFile.size,
      fileType: imageFile.type,
      checksum: await computeSHA256(imageFile),
    })

    const response = await fetch(putUrl.signedUrl as string, {
      method: "put",
      body: imageFile,
      headers: {
        "Content-Type": imageFile.type,
      },
    })

    if (putUrl.error || response.status !== StatusCodes.OK) {
      return { error: "Error uploading image!" }
    }

    const imagePublicUrl = getPublicUrl(String(fileName))

    await prisma.image.create({
      data: {
        imageUrl: imagePublicUrl,
        userId: session?.user.id as string,
        metadata: {
          fileSize: imageFile.size,
          fileType: imageFile.type,
        },
      },
    })
  } catch {
    return { error: "Something went wrong!" }
  }

  revalidatePath("/gallery")
  redirect("/gallery")
}

export async function deleteImage(imageId: number, fileName: string) {
  try {
    const deleteImage = await deleteObject(
      config.awsS3UserBucketName!,
      fileName
    )

    if (deleteImage.error) {
      return { error: "Error deleting image!" }
    }

    if (deleteImage.sucess) {
      await prisma.image.delete({ where: { id: imageId } })
    }
  } catch {
    return {
      error: "Something went wrong!",
    }
  }

  revalidatePath("/gallery")
  redirect("/gallery")
}

export async function transformImage(
  imageId: number,
  transformationPayload: Transformations
) {
  const compressionConfig = {
    jpeg: { quality: 100 - transformationPayload.compress },
    png: { compressionLevel: transformationPayload.compress / 10 },
  }

  try {
    const image = await prisma.image.findUnique({
      where: { id: Number(imageId) },
    })

    if (!image || !image.imageUrl) {
      return {
        error: "Image not found",
      }
    }

    // Fetch the image data
    const imageResponse = await fetch(image?.imageUrl)
    if (!imageResponse.ok) {
      return {
        error: `Failed to fetch image: ${imageResponse.statusText}`,
      }
    }

    const imageBuffer = await imageResponse.arrayBuffer()

    let transformer = sharp(Buffer.from(imageBuffer))

    if (transformationPayload.rotate) {
      transformer = transformer.rotate(transformationPayload.rotate)
    }

    if (transformationPayload.flip) {
      transformer = transformer.flip()
    }

    if (transformationPayload.mirror) {
      transformer = transformer.flop()
    }

    if (transformationPayload.compress) {
      transformer = transformer.jpeg({
        quality: transformationPayload.compress,
      })
    }

    if (transformationPayload.filter === "grayscale") {
      transformer = transformer.grayscale()
    }

    // TODO: Not working as expected
    if (transformationPayload.watermark) {
      const text = transformationPayload.watermark
      const fontSize = 32
      const fontFamily = "Times New Roman"
      const fill = "red"
      const svgImage = `<svg><text text-anchor="end" font-family="${fontFamily}" font-size="${fontSize}" fill="${fill}">${text}</text></svg>`
      const watermarkText = Buffer.from(svgImage)
      transformer = transformer.composite([
        {
          input: watermarkText,
          gravity: "southeast",
        },
      ])
    }

    if (transformationPayload.compress > 0) {
      const format =
        transformationPayload.format as keyof typeof compressionConfig
      if (format in compressionConfig) {
        transformer = transformer.toFormat(format, compressionConfig[format])
      }
    } else {
      // If no compression is specified, just convert to the desired format
      transformer = transformer.toFormat(
        transformationPayload.format as keyof typeof compressionConfig
      )
    }

    const { data, info } = await transformer.toBuffer({
      resolveWithObject: true,
    })

    const fileName = getFileNameWithFileType(
      `${extractPathFromUrl(image?.imageUrl)}-edited`,
      info.format
    )

    const putUrl = await getSignedPutUrl({
      bucketName: config.awsS3UserBucketName!,
      fileName,
      fileSize: info.size,
      fileType: `image/${info.format}`,
      checksum: "asdsad",
    })

    if (putUrl.error) {
      return {
        error: "Error uploading image!",
      }
    }

    const response = await fetch(putUrl.signedUrl!, {
      method: "PUT",
      body: data,
      headers: {
        "Content-Type": info.format,
      },
    })

    if (putUrl.error || response.status !== StatusCodes.OK) {
      return {
        error: "Error uploading image!",
      }
    }

    const imagePublicUrl = getPublicUrl(fileName)

    await prisma.image.create({
      data: {
        imageUrl: imagePublicUrl,
        userId: image?.userId,
        metadata: {
          fileSize: info.size,
          fileType: info.format,
        },
      },
    })
  } catch {
    return {
      error: "Something went wrong!",
    }
  }

  revalidatePath("/gallery")
  redirect("/gallery")
}
