"use server"

import * as z from "zod"
import { AuthError } from "next-auth"

import { signIn } from "@/auth"
import { LoginSchema } from "@/schemas/auth"
import { getUserByEmail } from "@/lib/data/user"
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/routes"
import { sendVerificationEmail } from "@/lib/utils/mail"
import { generateVerificationToken } from "@/lib/utils/tokens"

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success)
    return { error: "Invalid fields!" }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email)
  if (!existingUser || !existingUser.email || !existingUser.password)
    return { error: "User with email does not exist!" }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email)

    await sendVerificationEmail(email, verificationToken.token)
    return { success: "Confirmation email sent!" }
  }

  try {
    await signIn("credentials", {
      email, password, redirectTo: DEFAULT_LOGIN_REDIRECT
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" }
        default:
          return { error: "Something went wrong!" }
      }
    }
  }
}