"use server"

import * as z from "zod"

import { ResetSchema } from "@/schemas/auth"
import { getUserByEmail } from "@/lib/data/user"
import { sendPasswordResetEmail } from "@/lib/utils/mail"
import { generatePasswordResetToken } from "@/lib/utils/tokens"

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values)

  if (!validatedFields.success)
    return { error: "Invalid fields!" }

  const { email } = validatedFields.data

  const existingUser = await getUserByEmail(email)
  if (!existingUser)
    return { error: "User with email does not exist!" }

  const passwordToken = await generatePasswordResetToken(email)
  await sendPasswordResetEmail(email, passwordToken.token)

  return { succcess: "Password reset email sent!" }
}