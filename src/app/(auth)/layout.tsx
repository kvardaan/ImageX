import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

interface LayoutProps {
  children: React.ReactNode
}

export default async function Layout({ children }: LayoutProps) {
  const session = await auth()
  if (session?.user) redirect("/overview")

  return (
    <div className="flex items-center justify-center h-screen">{children}</div>
  )
}
