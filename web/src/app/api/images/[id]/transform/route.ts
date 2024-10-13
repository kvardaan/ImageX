import sharp from "sharp"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/clients/prisma"
import { config } from "@/lib/utils/config"
import { deleteObject, getSignedPutUrl } from "@/lib/clients/aws.S3"

import { Transformations } from "@/components/protected/gallery/edit/editImage"
import { computeSHA256, getPublicUrl } from "@/lib/utils"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  const imageId = Number(params.id)
  const body = await request.json()
  const transformationPayload = await body.payload

  try {
    const image = await prisma.image.findUnique({
      where: { id: imageId },
    })

    let transformer = sharp(image?.imageUrl!).toFormat(transformationPayload.format)

    if (transformationPayload.resize?.width && transformationPayload.resize?.height) {
      transformer = transformer.resize({
        width: transformationPayload.resize?.width,
        height: transformationPayload.resize?.height
      })
    }

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

    if (transformationPayload.watermark) {
      transformer = transformer.composite([
        {
          input: transformationPayload.watermark,
          gravity: "southeast",
        },
      ])
    }

    const { data, info } = await transformer.toBuffer({
      resolveWithObject: true,
    })

    const deleteImage = await deleteObject(
      config.awsS3UserBucketName!,
      image?.imageUrl?.split("imagex.user/").pop()!
    )

    if (deleteImage.error) {
      return NextResponse.json(
        { error: "Error deleting image!" },
        { status: StatusCodes.FAILED_DEPENDENCY }
      )
    }

    const putUrl = await getSignedPutUrl({
      bucketName: config.awsS3UserBucketName!,
      fileName: `${image?.imageUrl?.split("imagex.user/").pop()!}-edited`,
      fileSize: info.size,
      fileType: info.format,
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

    const imagePublicUrl = getPublicUrl(String(image?.imageUrl?.split("imagex.user/").pop()!))

    await prisma.image.update({
      where: { id: imageId },
      data: {
        imageUrl: putUrl.signedUrl,
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