import { type DefaultSession } from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
  isOAuth: boolean
  image: string
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}
