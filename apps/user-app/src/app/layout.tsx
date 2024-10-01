import { Toaster } from "sonner";
import type { Metadata } from "next";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          <SessionProvider session={session}>
            {children}
            <Toaster richColors closeButton duration={2000} />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
