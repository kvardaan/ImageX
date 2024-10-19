import prisma from "@/lib/clients/prisma"
import { Account } from "@/lib/types/account"

/**
 * Finds the user's account from the DB using Id
 */
export const getAccountByUserId = async (
  userId: string
): Promise<Account | null> => {
  try {
    const account = await prisma.account.findFirst({
      where: { userId },
    })

    return account
  } catch {
    return null
  }
}
