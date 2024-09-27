import * as z from "zod"

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string().nullable(),
  emailVerified: z.date().nullable(),
  profileUrl: z.string().nullable(),
  planId: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type User = z.infer<typeof UserSchema>