import * as z from "zod"

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string().optional(),
  emailVerified: z.date().optional(),
  profileUrl: z.string().optional(),
  planId: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type User = z.infer<typeof UserSchema>
