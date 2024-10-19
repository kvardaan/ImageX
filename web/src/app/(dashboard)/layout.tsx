import { AppBar } from "@/components/dashboard/appBar"
import { Footer } from "@/components/dashboard/footer"
import { SideBar } from "@/components/dashboard/sideBar"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
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
