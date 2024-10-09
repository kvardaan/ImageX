"use client"

import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

export const LogoutButton = () => {
  const router = useRouter()

  const onClick = () => {
    signOut()
    router.push("/")
  }

  return (
    <div onClick={onClick} className="cursor-pointer w-full">
      <Button
        variant="ghost"
        className="w-full flex flex-row items-center justify-start gap-x-2 bg-gray-50 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/25"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign out</span>
      </Button>
    </div>
  )
}
