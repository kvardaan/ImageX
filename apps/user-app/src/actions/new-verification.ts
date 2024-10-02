"use server"

import { prisma } from "@repo/database"
import { getUserByEmail } from "@/lib/data/user"
import { getVerificationTokenByToken } from "@/lib/data/verification-token"

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token)

  if (!existingToken)
    return { error: "Token does not exist!" }

  const hasExpired = new Date() > new Date(existingToken.expires)

  if (hasExpired)
    return { error: "Token has expired!" }

  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser)
    return { error: "User with email does not exist!" }

  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.user.update({
        where: { id: existingUser.id },
        data: {
          emailVerified: new Date(),
          email: existingToken.email
        }
      })

      await transaction.verificationToken.delete({
        where: { id: existingToken.id },
      })

    })
  }
  catch (error) {
    console.log(`Error verifying user: ${String(error)}`);
    return { error: "Something went wrong!" }
  }

  return { success: "Email verified!" }
}