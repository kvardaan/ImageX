import sharp from "sharp"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"

import {
  getFileNameWithFileType,
  extractPathFromUrl,
  getPublicUrl,
} from "@/lib/utils"
import prisma from "@/lib/clients/prisma"
import { config } from "@/lib/utils/config"
import { Transformations } from "@/lib/types/image"
import { getSignedPutUrl } from "@/lib/clients/aws.S3"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  const imageId = Number(params.id)
  const transformationPayload: Transformations = await request.json()

  const compressionConfig = {
    jpeg: { quality: 100 - transformationPayload.compress },
    png: { compressionLevel: transformationPayload.compress / 10 },
  }

  try {
    const image = await prisma.image.findUnique({
      where: { id: imageId },
    })

    if (!image || !image.imageUrl) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: StatusCodes.NOT_FOUND }
      )
    }

    // Fetch the image data
    const imageResponse = await fetch(image?.imageUrl)
    if (!imageResponse.ok) {
      return NextResponse.json({
        error: `Failed to fetch image: ${imageResponse.statusText}`,
        status: imageResponse.status,
      })
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
      return NextResponse.json(
        { error: "Error uploading image!" },
        { status: StatusCodes.FAILED_DEPENDENCY }
      )
    }

    const response = await fetch(putUrl.signedUrl!, {
      method: "PUT",
      body: data,
      headers: {
        "Content-Type": info.format,
      },
    })

    if (putUrl.error || response.status !== StatusCodes.OK) {
      return NextResponse.json(
        { error: "Error uploading image!" },
        { status: StatusCodes.FAILED_DEPENDENCY }
      )
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

    return NextResponse.json(
      { image, imagePublicUrl },
      { status: StatusCodes.OK }
    )
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    )
  }
}
