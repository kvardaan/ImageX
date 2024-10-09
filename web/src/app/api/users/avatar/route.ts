import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/clients/prisma"
import { config } from "@/lib/utils/config"
import { getSignedPutUrl } from "@/lib/clients/aws.S3"
import { computeSHA256, getPublicUrl } from "@/lib/utils"

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const userId = formData.get("userId") as string
  const fileName = formData.get("fileName") as string
  const imageFile = formData.get("file") as File

  try {
    const putUrl = await getSignedPutUrl({
      bucketName: config.awsS3UserBucketName!,
      fileName: fileName!,
      fileSize: imageFile.size,
      fileType: imageFile.type,
      checksum: await computeSHA256(imageFile),
    })

    const response = await fetch(putUrl.signedUrl as string, {
      method: "put",
      body: imageFile,
    })

    if (putUrl.error || response.status !== StatusCodes.OK) {
      return new NextResponse(
        JSON.stringify({ message: "Error uploading avatar!" }),
        { status: StatusCodes.FAILED_DEPENDENCY }
      )
    }

    const avatarPublicUrl = getPublicUrl(String(fileName))

    await prisma.user.update({
      where: { id: String(userId) },
      data: {
        profileUrl: avatarPublicUrl,
      },
    })

    return new NextResponse(JSON.stringify({ status: StatusCodes.CREATED }))
  } catch {
    return new NextResponse(
      JSON.stringify({ status: StatusCodes.INTERNAL_SERVER_ERROR })
    )
  }
}
