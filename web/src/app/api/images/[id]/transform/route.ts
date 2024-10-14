import sharp from "sharp"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/clients/prisma"
import { config } from "@/lib/utils/config"
import { getSignedPutUrl } from "@/lib/clients/aws.S3"
import { getFileNameWithFileType, extractPathFromUrl, getPublicUrl } from "@/lib/utils"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  const imageId = Number(params.id)
  const transformationPayload = await request.json()

  try {
    const image = await prisma.image.findUnique({
      where: { id: imageId },
    })

    console.log(image?.imageUrl)

    if (!image || !image.imageUrl) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: StatusCodes.NOT_FOUND }
      )
    }

    // Fetch the image data
    const imageResponse = await fetch(image?.imageUrl)
    if (!imageResponse.ok) {
      return NextResponse.json({ error: `Failed to fetch image: ${imageResponse.statusText}`, status: imageResponse.status })
    }

    const imageBuffer = await imageResponse.arrayBuffer()

    let transformer = sharp(Buffer.from(imageBuffer)).toFormat(transformationPayload.format)

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
      transformer = transformer.jpeg({ quality: transformationPayload.compress })
    }

    if (transformationPayload.filter === "grayscale") {
      transformer = transformer.grayscale()
    }

    // TODO: Not Working
    if (transformationPayload.watermark) {
      const watermarkText = Buffer.from(`<svg><text x="10" y="20" font-family="Arial" font-size="24" fill="white">${transformationPayload.watermark}</text></svg>`)
      transformer = transformer.composite([
        {
          input: watermarkText,
          gravity: "southeast",
        },
      ])
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
      }
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

    return NextResponse.json({ image, imagePublicUrl }, { status: StatusCodes.OK })
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    )
  }
}