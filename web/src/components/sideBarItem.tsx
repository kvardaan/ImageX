"use client"

import { usePathname, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SideBarItemProps {
  href: string
  title: string
  icon: React.ReactNode
  children?: React.ReactNode
}

const SideBarItem = ({ href, title, icon, children }: SideBarItemProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const selected = pathname === href

  return (
    <Button
      variant="ghost"
      onClick={() => router.push(href)}
      className={cn(
        "w-full flex flex-row items-center justify-start gap-x-2 bg-gray-50 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/25",
        selected && "bg-gray-200 dark:bg-white/25"
      )}
    >
      {icon}
      {title}
      {children}
    </Button>
  )
}

export { SideBarItem }
