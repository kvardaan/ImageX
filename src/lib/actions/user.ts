"use server"

import { z } from "zod"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { StatusCodes } from "http-status-codes"

import {
  getFileNameWithFileType,
  computeSHA256,
  getPublicUrl,
} from "@/lib/utils"
import { auth } from "@/lib/auth"
import prisma from "@/lib/clients/prisma"
import { config } from "@/lib/utils/config"
import { getSignedPutUrl } from "@/lib/clients/aws.S3"

const UserUpdateSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(32, { message: "Name should be less than 32 characters" }),
})

export async function changeName(userName: string) {
  const session = await auth()

  const validatedFields = UserUpdateSchema.safeParse({ name: userName })

  if (!validatedFields.success)
    return {
      error: validatedFields.error.issues[0].message,
    }

  try {
    await prisma.user.update({
      where: { id: session?.user.id },
      data: {
        name: validatedFields.data.name,
      },
    })
  } catch {
    return {
      error: "Something went wrong!",
    }
  }

  revalidatePath("/settings")
  redirect("/settings")
}

export async function changeAvatar(formData: FormData) {
  const session = await auth()

  const imageFile = formData.get("file") as File
  const fileName = getFileNameWithFileType(
    session?.user.id as string,
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
      return { error: "Error uploading avatar!" }
    }

    const avatarPublicUrl = getPublicUrl(String(fileName))

    await prisma.user.update({
      where: { id: session?.user.id },
      data: {
        profileUrl: avatarPublicUrl,
      },
    })
  } catch {
    return { error: "Something went wrong!" }
  }

  revalidatePath("/settings")
  redirect("/settings")
}
