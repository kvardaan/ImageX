import { cn } from "@/lib/utils"
import { lusitana } from "@/lib/utils/fonts"

type HeadingProps = {
  title: string
  className?: string
  children?: React.ReactNode
}

export function Heading({ title, className, children }: HeadingProps) {
  return (
    <h1
      className={cn(
        lusitana.className,
        "font-medium text-4xl m-2 text-center md:text-left",
        className
      )}
    >
      {title}
      {children}
    </h1>
  )
}
