import { Toaster } from "sonner"
import type { Metadata } from "next"
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

import "@/app/globals.css"
import { auth } from "@/auth"
import { poppins } from "@/lib/utils/fonts"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/sessionProvider"

export const metadata: Metadata = {
  title: {
    template: "%s | ImageX",
    default: "ImageX",
  },
  description: "A simple image processing service",
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  const session = await auth()

  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased text-black dark:text-white`}
      >
        <ThemeProvider>
          <NextAuthSessionProvider session={session}>
            <SessionProvider>{children}</SessionProvider>
            <Toaster richColors closeButton duration={2000} />
          </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
