import { redirect } from "next/navigation"

import { cn } from "@/lib/utils"
import { auth } from "@/lib/auth"
import { poppins } from "@/lib/utils/fonts"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LoginButton } from "@/components/auth/loginButton"

export default async function Home() {
  const session = await auth()
  if (session?.user) redirect("/overview")

  return (
    <main className="flex flex-col h-screen items-center justify-center">
      <div className="space-y-6 text-center">
        <ThemeToggle />
        <h1
          className={cn(
            "text-6xl font-semibold drop-shadow-md",
            poppins.className
          )}
        >
          ImageX
        </h1>
        <p className="text-xl">A simple image processing service</p>
        <div>
          <LoginButton>
            <Button variant="secondary" size="lg">
              Login
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  )
}
