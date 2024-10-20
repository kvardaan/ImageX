import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { AppBar } from "@/components/dashboard/appBar"
import { Footer } from "@/components/dashboard/footer"
import { SideBar } from "@/components/dashboard/sideBar"

interface LayoutProps {
  children: React.ReactNode
}

export default async function Layout({ children }: LayoutProps) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="flex flex-col min-h-screen">
      <AppBar />
      <main className="flex-grow flex flex-row md:justify-between gap-2 w-full p-3 dark:text-white">
        <SideBar />
        {children}
      </main>
      <Footer />
    </div>
  )
}
