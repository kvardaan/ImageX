import prisma from "@/lib/clients/prisma"
import { VerificationToken } from "@/lib/types/verificationToken"

/**
 * Finds the verification token from the DB using user's email
 */
export const getVerificationTokenByEmail = async (
  email: string
): Promise<VerificationToken | null> => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { email },
    })

    return verificationToken
  } catch {
    return null
  }
}

/**
 * Finds the verification token from the DB using token
 */
export const getVerificationTokenByToken = async (
  token: string
): Promise<VerificationToken | null> => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    return verificationToken
  } catch {
    return null
  }
}
