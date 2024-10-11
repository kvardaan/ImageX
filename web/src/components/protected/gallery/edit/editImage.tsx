"use client"

import { toast } from "sonner"
import { useCallback, useEffect, useState } from "react"

import { Image } from "@/lib/types/image"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatImageMetadata } from "@/lib/utils/image"
import { EditOptions } from "@/components/protected/gallery/edit/editOptions"

export interface Transformations {
  resize: number
  crop: { x: number; y: number; width: number; height: number }
  rotate: 0
  watermark: ""
  flip: boolean
  mirror: boolean
  compress: number
  format: string
  filter: string
}

export const EditImage = ({ id }: { id: number }) => {
  const [image, setImage] = useState<Image | null>(null)
  const [transformations, setTransformations] = useState<Transformations>({
    resize: 100,
    crop: { x: 0, y: 0, width: 100, height: 100 },
    rotate: 0,
    watermark: "",
    flip: false,
    mirror: false,
    compress: 100,
    format: "",
    filter: "none",
  })

  const fetchImage = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/images/${id}`)
      const data = await response.json()
      if (data.error) {
        toast.error(data.error)
      } else {
        setImage(data.image)
        if (data.image?.metadata) {
          const { fileType } = formatImageMetadata(
            JSON.stringify(data.image.metadata)
          )
          setTransformations((prev) => ({ ...prev, format: fileType }))
        }
      }
    } catch {
      toast.error("Error fetching image!")
    }
  }, [id])

  useEffect(() => {
    fetchImage()
  }, [fetchImage])

  const handleTransformationChange = (key: string, value: any) => {
    setTransformations((prev) => ({ ...prev, [key]: value }))
  }

  const applyTransformations = () => {
    // Here you would typically send the transformations to your backend
    // and receive a transformed image URL in response
    toast.success("Transformations applied!")
  }

  if (!image) {
    return (
      <div className="min-h-[475px] h-full flex items-center justify-center bg-white dark:bg-black/50 border dark:border-white/25 rounded-lg p-2">
        <Skeleton className="w-full h-full" />
      </div>
    )
  }

  return (
    <div className="min-h-[475px] h-full flex flex-col lg:flex-row items-start justify-center gap-2 bg-white dark:bg-black/50 border dark:border-white/25 rounded-lg p-2">
      <div className="w-full lg:w-2/3 h-1/3 border rounded-sm dark:border-white/25 p-2">
        <img
          src={image.imageUrl!}
          alt="Image"
          className="rounded-sm border-2 dark:border-white/25 w-full h-full object-contain"
        />
      </div>
      <div className="flex flex-col gap-2 justify-between w-full lg:w-1/3 h-full border rounded-md dark:border-white/25 p-2">
        <EditOptions
          transformations={transformations}
          handleTransformationChange={handleTransformationChange}
        />
        <Button onClick={applyTransformations} className="w-full mt-4">
          Apply Transformations
        </Button>
      </div>
    </div>
  )
}
