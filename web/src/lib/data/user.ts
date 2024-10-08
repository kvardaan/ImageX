import { User } from "@/lib/types/user"
import prisma from "@/lib/clients/prisma"
import { currentUser } from "@/lib/utils/auth"

/**
 * Returns the ID of the logged in user
 */
export const getUserID = async (): Promise<string | undefined> => {
  const user = await currentUser()

  return user?.id
}

/**
 * Finds the user from the DB using Id
 */
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  } catch {
    return null;
  }
};

/**
 * Finds the user from the DB using Email
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  } catch {
    return null;
  }
};

interface UserType {
  name: string;
  email: string;
  password: string;
}

/**
 * Creates a new user.
 * Requires an email and hashed password
 */
export const createUser = async ({
  name,
  email,
  password,
}: UserType): Promise<void> => {
  await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
};