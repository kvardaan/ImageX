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
  const [transformations, setTransformations] = useState<Transformations>({
    resize: 0,
    crop: { x: 0, y: 0, width: 100, height: 100 },
    rotate: 0,
    watermark: "",
    flip: false,
    mirror: false,
    compress: 0,
    format: "",
    filter: "none",
  })
  const [isApplying, setIsApplying] = useState<boolean>(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

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

  const handleTransformationChange = (
    key: keyof Transformations,
    value: number | boolean | string | JSON
  ) => {
    setTransformations((prev) => ({ ...prev, [key]: value }))
  }

  const applyTransformationsToCanvas = useCallback(() => {
    if (canvasRef.current && imageRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        const img = imageRef.current

        // Reset canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        // Set canvas size based on resize
        const scale = transformations.resize / 100
        canvasRef.current.width = img.width * scale
        canvasRef.current.height = img.height * scale

        // Apply transformations
        ctx.translate(canvasRef.current.width / 2, canvasRef.current.height / 2)
        ctx.rotate((transformations.rotate * Math.PI) / 180)
        ctx.scale(
          transformations.mirror ? -1 : 1,
          transformations.flip ? -1 : 1
        )
        ctx.translate(
          -canvasRef.current.width / 2,
          -canvasRef.current.height / 2
        )

        // Draw image
        ctx.drawImage(
          img,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        )

        // Apply watermark
        if (transformations.watermark) {
          ctx.font = "20px Arial"
          ctx.fillStyle = "rgba(0, 100, 0, 0.5)"
          ctx.fillText(transformations.watermark, 100, 30)
        }

        // Apply crop
        if (transformations.crop) {
          ctx.drawImage(
            img,
            transformations.crop.x,
            transformations.crop.y,
            transformations.crop.width,
            transformations.crop.height,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          )
        }

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
        } else if (transformations.filter === "sepia") {
          const imageData = ctx.getImageData(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          )
          for (let i = 0; i < imageData.data.length; i += 4) {
            const r = imageData.data[i]
            const g = imageData.data[i + 1]
            const b = imageData.data[i + 2]
            imageData.data[i] = r * 0.393 + g * 0.769 + b * 0.189
            imageData.data[i + 1] = r * 0.349 + g * 0.686 + b * 0.168
            imageData.data[i + 2] = r * 0.272 + g * 0.534 + b * 0.131
          }
          ctx.putImageData(imageData, 0, 0)
        }

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        ctx.drawImage(imageRef.current, 0, 0)
      }
    }
  }, [transformations])

  useEffect(() => {
    if (image) {
      applyTransformationsToCanvas()
    }
  }, [image, applyTransformationsToCanvas])

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
        setImage((prevImage) => ({ ...prevImage!, imageUrl: data.imageUrl }))
        toast.success("Transformations applied!")
      }
    } catch {
      toast.error("Error applying transformations!")
    } finally {
      setIsApplying(false)
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
        <canvas
          ref={canvasRef}
          className="rounded-sm border-2 dark:border-white/25 w-full h-full object-contain"
        />
        <img
          ref={imageRef}
          src={image.imageUrl!}
          alt="Image"
          className="hidden"
          onLoad={applyTransformationsToCanvas}
        />
      </div>
      <div className="flex flex-col gap-2 justify-between w-full lg:w-1/3 h-full border rounded-md dark:border-white/25 p-2 pb-4">
        <EditOptions
          transformations={transformations}
          handleTransformationChange={handleTransformationChange}
        />
        <Button
          onClick={applyTransformations}
          size="lg"
          className="mx-auto"
          disabled={isApplying}
        >
          {isApplying ? "Applying..." : "Apply Transformations"}
        </Button>
      </div>
    </div>
  )
}
