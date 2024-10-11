"use client"

import { toast } from "sonner"
import { useCallback, useEffect, useRef, useState } from "react"

import { ImageType } from "@/lib/types/image"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatImageMetadata } from "@/lib/utils/image"
import { EditOptions } from "@/components/protected/gallery/edit/editOptions"

export interface Transformations {
  resize: number
  crop: { x: number; y: number; width: number; height: number }
  rotate: number
  watermark: string
  flip: boolean
  mirror: boolean
  compress: number
  format: string
  filter: string
}

export const EditImage = ({ id }: { id: number }) => {
  const [image, setImage] = useState<ImageType | null>(null)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [transformations, setTransformations] = useState<Transformations>({
    resize: 100,
    crop: { x: 0, y: 0, width: 100, height: 100 },
    rotate: 0,
    watermark: "",
    flip: false,
    mirror: false,
    compress: 0,
    format: "",
    filter: "none",
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const fetchImage = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/images/${id}`)
      const data = await response.json()

      if (data.error) {
        toast.error(data.error)
      } else {
        setImage(data.image)
        // setOriginalImageUrl(data.image.imageUrl)
        // setPreviewImageUrl(data.image.imageUrl)

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

  const handleTransformationChange = (
    key: keyof Transformations,
    value: number | boolean | string | JSON
  ) => {
    setTransformations((prev) => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    if (originalImageUrl) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d")
          if (ctx) {
            canvasRef.current.width = img.width
            canvasRef.current.height = img.height

            // Apply transformations
            ctx.save()
            ctx.translate(
              canvasRef.current.width / 2,
              canvasRef.current.height / 2
            )

            if (transformations.rotate !== 0) {
              ctx.rotate((transformations.rotate * Math.PI) / 180)
            }

            if (transformations.flip) {
              ctx.scale(1, -1)
            }

            ctx.drawImage(
              img,
              -img.width / 2,
              -img.height / 2,
              img.width,
              img.height
            )
            ctx.restore()

            // Apply filters
            if (transformations.filter === "grayscale") {
              const imageData = ctx.getImageData(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
              )
              for (let i = 0; i < imageData.data.length; i += 4) {
                const avg =
                  (imageData.data[i] +
                    imageData.data[i + 1] +
                    imageData.data[i + 2]) /
                  3
                imageData.data[i] = avg
                imageData.data[i + 1] = avg
                imageData.data[i + 2] = avg
              }
              ctx.putImageData(imageData, 0, 0)
            }

            // Note: Blur and sharpen are complex operations that are difficult to implement
            // efficiently in JavaScript. For a production app, you might want to use a library
            // like CamanJS for these operations.

            setPreviewImageUrl(canvasRef.current.toDataURL())
          }
        }
      }
      img.src = originalImageUrl
    }
  }, [originalImageUrl, transformations])

  const applyTransformations = async () => {
    try {
      const response = await fetch(`api/images/${id}/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformations),
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error)
      } else {
        setOriginalImageUrl(data.imageUrl)
        setPreviewImageUrl(data.imageUrl)
        toast.success("Transformations applied!")
      }
    } catch {
      toast.error("Error applying transformations!")
    }
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
      <div className="w-full lg:w-2/3 h-full border rounded-sm dark:border-white/25 p-2">
        <img
          src={image.imageUrl!}
          alt="Image"
          className="rounded-sm border-2 dark:border-white/25 w-full h-full object-contain"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <div className="flex flex-col gap-2 justify-between w-full lg:w-1/3 h-full border rounded-md dark:border-white/25 p-2 pb-4">
        <EditOptions
          transformations={transformations}
          handleTransformationChange={handleTransformationChange}
        />
        <Button onClick={applyTransformations} size="lg" className="mx-auto">
          Apply Transformations
        </Button>
      </div>
    </div>
  )
}
