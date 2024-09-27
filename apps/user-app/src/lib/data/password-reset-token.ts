import { prisma } from "@repo/database";
import { PasswordResetToken } from "@/lib/types/passwordResetToken"

/**
 * Finds the password token from the DB using user's email
 */
export const getPasswordResetTokenByEmail = async (email: string): Promise<PasswordResetToken | null> => {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findFirst({
      where: { email },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

/** 
 * Finds the password token from the DB using token
*/
export const getPasswordResetTokenByToken = async (token: string): Promise<PasswordResetToken | null> => {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};