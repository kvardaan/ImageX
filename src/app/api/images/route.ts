import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"

import {
  getFileNameWithFileType,
  computeSHA256,
  getPublicUrl,
} from "@/lib/utils"
import { auth } from "@/lib/auth"
import prisma from "@/lib/clients/prisma"
import { config } from "@/lib/utils/config"
import { getSignedPutUrl } from "@/lib/clients/aws.S3"

export async function GET() {
  const session = await auth()
  try {
    const images = await prisma.image.findMany({
      where: { userId: session?.user.id },
    })

    return NextResponse.json(images, { status: StatusCodes.CREATED })
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    )
  }
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const userId = formData.get("userId") as string
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
      return NextResponse.json(
        { error: "Error uploading image!" },
        { status: StatusCodes.FAILED_DEPENDENCY }
      )
    }

    const imagePublicUrl = getPublicUrl(String(fileName))

    const newImage = await prisma.image.create({
      data: {
        imageUrl: imagePublicUrl,
        userId,
        metadata: {
          fileSize: imageFile.size,
          fileType: imageFile.type,
        },
      },
    })

    return NextResponse.json(
      { image: newImage },
      { status: StatusCodes.CREATED }
    )
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    )
  }
}
