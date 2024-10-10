"use client"

import { toast } from "sonner"
import { useEffect, useState } from "react"

import { Image } from "@/lib/types/image"
import { Skeleton } from "@/components/ui/skeleton"

export const EditImage = ({ id }: { id: number }) => {
  const [image, setImage] = useState<Image>()

  const fetchImage = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/images/${id}`)
      const data = await response.json()
      if (data.error) toast.error(data.error)
      else setImage(data.image)
    } catch {
      toast.error("Error fetching image!")
    }
  }

  useEffect(() => {
    fetchImage()
  }, [])

  return (
    <div className="min-h-[475px] h-full flex flex-col lg:flex-row items-center justify-center gap-2 bg-white dark:bg-black/50 border dark:border-white/25 rounded-lg p-2">
      <div className="w-2/3 h-1/3 border rounded-sm dark:border-white/25 p-2">
        {image ? (
          <img
            src={image?.imageUrl!}
            alt="Image"
            className="rounded-md border-2 border-red-200"
          />
        ) : (
          <Skeleton className="w-100 h-100" />
        )}
      </div>
      <div className="flex flex-col gap-2 items-center justify-between w-1/3 h-full border rounded-md dark:border-white/25 p-2">
        Sliders / Editors come here
      </div>
    </div>
  )
}
