import prisma from "@/lib/clients/prisma"

/**
 * Finds the user's account from the DB using Id
 */
export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await prisma.account.findFirst({
      where: { userId },
    })

    return account
  } catch {
    return null
  }
}
