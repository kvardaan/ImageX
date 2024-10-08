import { compare, hash } from "bcrypt"

import { auth } from "@/auth"

/**
 * Finds the user from the session
 */
export const currentUser = async () => {
  const session = await auth();

  return {
    ...session?.user
  };
};

/**
 * Returns the password by hashing it
 */
export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
};

/**
 * Checks if the password is correct or not
 */
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await compare(password, hashedPassword);
};