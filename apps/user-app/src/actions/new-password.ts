"use server"

import * as z from "zod"

import { prisma } from "@repo/database"
import { hashPassword } from "@/lib/utils/auth"
import { getUserByEmail } from "@/lib/data/user"
import { NewPasswordSchema } from "@/schemas/auth"
import { getPasswordResetTokenByToken } from "@/lib/data/password-reset-token"

export const newPassword = async (values: z.infer<typeof NewPasswordSchema>, token: string) => {
  if (!token)
    return { error: "Missing token!" }

  const validatedFields = NewPasswordSchema.safeParse(values)

  if (!validatedFields.success)
    return { error: "Invalid fields!" }

  const { password } = validatedFields.data

  const existingToken = await getPasswordResetTokenByToken(token)

  if (!existingToken)
    return { error: "Token does not exist!" }

  const hasExpired = new Date() > new Date(existingToken.expires)

  if (hasExpired)
    return { error: "Token has expired!" }

  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser)
    return { error: "User with email does not exist!" }

  const hashedPassword = await hashPassword(password)

  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword }
      })

      await transaction.passwordResetToken.delete({
        where: { id: existingToken.id }
      })
    })
  } catch (error) {
    console.log(`Error changing user's password: ${String(error)}`);
    return { error: "Something went wrong!" }
  }

  return { success: "Password updated!" }
}