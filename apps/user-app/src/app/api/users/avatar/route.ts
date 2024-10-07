import axios from "axios"
import { StatusCodes } from "http-status-codes"
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@repo/database";
import { config } from "@/lib/utils/config";
import { getPublicUrl } from "@/lib/utils/aws.s3";
import { createPresignedGetURL, createPresignedPutURL } from "@repo/aws_s3"

export async function PATCH(request: NextRequest) {
  const formData = await request.formData();
  const userId = formData.get("userId");
  const fileName = formData.get("fileName");
  const contentType = formData.get("contentType");
  const imageFile: any = formData.get("file");

  try {
    const fileBuffer = Buffer.from(await imageFile?.arrayBuffer())
    const postUrl = await createPresignedPutURL(String(config.awsS3UserBucketName), String(fileName), String(contentType), fileBuffer)

    const response = await axios({
      method: "put",
      url: String(postUrl),
      data: fileBuffer,
      headers: {
        "Content-Type": String(contentType),
      }
    })

    if (!response) {
      return new NextResponse(JSON.stringify({ message: "Error uploading image!" }), { status: StatusCodes.FAILED_DEPENDENCY })
    }

    const avatarPublicUrl = getPublicUrl(String(userId))

    await prisma.user.update({
      where: { id: String(userId) },
      data: {
        profileUrl: avatarPublicUrl,
      }
    })

    return new NextResponse(JSON.stringify({ avatarPublicUrl }), { status: StatusCodes.CREATED });
  } catch (error) {
    console.error(`Error adding image: ${JSON.stringify(error)}`)
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: StatusCodes.INTERNAL_SERVER_ERROR })
  }
}