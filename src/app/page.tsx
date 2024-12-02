import Link from "next/link"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { CustomButton } from "@/components/customButton"

export default async function Home() {
  const session = await auth()
  if (session?.user) redirect("/gallery")

  return (
    <main className="flex flex-col h-screen items-center text-center">
      <div className="h-full w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_80%)]"></div>
        <div className="flex flex-col space-y-4">
          <h1 className="text-4xl sm:text-7xl font-bold relative z-10 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-2 md:py-4">
            ImageX
          </h1>
          <p className="md:text-xl text-wrap">
            Edit your images like never before
          </p>
          <CustomButton />
        </div>
      </div>
      <footer className="w-full flex items-center justify-between bottom-0 p-4 border-t dark:border-white/15 dark:bg-black dark:text-white">
        <div className="flex flex-col gap-2 items-start">
          <Link href="/" className="text-sm md:text-lg font-bold">
            ImageX
          </Link>
          <span className="text-sm text-black/50 dark:text-white/50">
            A product by{" "}
            <Link
              href="www.github.com/kvardaan"
              className="font-bold dark:text-blue-400"
            >
              @kvardaan
            </Link>
          </span>
        </div>
        <ThemeToggle />
      </footer>
    </main>
  )
}
