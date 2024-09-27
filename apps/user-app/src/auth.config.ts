import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

import { config } from "@/lib/config";
import { SignInSchema } from "@/schemas/auth";
import { comparePassword } from "@/lib/utils";
import { getUserByEmail } from "@/lib/data/user";

export default {
  providers: [
    Google({
      clientId: config.googleClientId,
      clientSecret: config.googleSecretKey,
    }),
    GitHub({
      clientId: config.githubClientId,
      clientSecret: config.githubSecretKey,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const validCredentials = SignInSchema.safeParse(credentials);

        if (!validCredentials.success) return null;
        const { email, password } = validCredentials.data;

        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;

        const doPasswordsMatch = await comparePassword(password, user.password);

        return doPasswordsMatch
          ? { id: user.id.toString(), email: user.email, name: user.name }
          : null;
      },
    }),
  ],
} satisfies NextAuthConfig;