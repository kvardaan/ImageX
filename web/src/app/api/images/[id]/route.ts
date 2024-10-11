import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server"

import prisma from "@/lib/clients/prisma"
import { config } from "@/lib/utils/config"
import { deleteObject } from "@/lib/clients/aws.S3"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id)

  try {
    const image = await prisma.image.findUnique({
      where: { id },
    })

    return NextResponse.json({ image }, { status: StatusCodes.OK })
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id)
  const body = await request.json()
  const fileName = await body.fileName

  try {
    const deleteImage = await deleteObject(
      config.awsS3UserBucketName!,
      fileName
    )

    if (deleteImage.error) {
      return NextResponse.json(
        { error: "Error deleting image!" },
        { status: StatusCodes.FAILED_DEPENDENCY }
      )
    }

    if (deleteImage.sucess) {
      await prisma.image.delete({ where: { id } })
      return NextResponse.json({ status: StatusCodes.OK })
    }
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    )
  }
}
