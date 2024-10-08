import * as z from "zod"

export const VerificationToken = z.object({
  id: z.string(),
  email: z.string().email(),
  token: z.string(),
  expires: z.date(),
})

export type VerificationToken = z.infer<typeof VerificationToken>