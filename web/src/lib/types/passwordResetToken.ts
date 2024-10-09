import * as z from "zod"

export const PasswordResetToken = z.object({
  id: z.string(),
  email: z.string().email(),
  token: z.string(),
  expires: z.date(),
})

export type PasswordResetToken = z.infer<typeof PasswordResetToken>
