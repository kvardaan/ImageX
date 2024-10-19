import { TriangleAlert } from "lucide-react"

import { CardWrapper } from "@/components/auth/cardWrapper"

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonHref="/login"
      backButtonLabel="Back to login"
    >
      <div className="w-full flex items-center justify-center">
        <TriangleAlert className="w-10 h-10 text-destructive" />
      </div>
    </CardWrapper>
  )
}
