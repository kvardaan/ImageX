"use client"

import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatImageMetadata } from "@/lib/utils/image"
import { Image, Transformations } from "@/lib/types/image"
import { EditOptions } from "@/components/protected/gallery/edit/editOptions"

export const EditImage = ({ id }: { id: number }) => {
  const router = useRouter()
  const [image, setImage] = useState<Image | null>(null)
  const [transformations, setTransformations] = useState<Transformations>({
    resize: 100,
    // crop: { x: 0, y: 0, width: 100, height: 100 },
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

        // Calculate new dimensions based on resize
        const scale = transformations.resize / 100
        const newWidth = img.naturalWidth * scale
        const newHeight = img.naturalHeight * scale

        // Calculate canvas size to fit rotated image
        const rotateRad = (transformations.rotate * Math.PI) / 180
        const canvasWidth = Math.ceil(
          Math.abs(newWidth * Math.cos(rotateRad)) +
            Math.abs(newHeight * Math.sin(rotateRad))
        )
        const canvasHeight = Math.ceil(
          Math.abs(newWidth * Math.sin(rotateRad)) +
            Math.abs(newHeight * Math.cos(rotateRad))
        )

        // Set canvas size
        canvasRef.current.width = canvasWidth
        canvasRef.current.height = canvasHeight

        // Clear canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)

        // Move to center of canvas
        ctx.translate(canvasWidth / 2, canvasHeight / 2)

        // Apply rotate
        ctx.rotate(rotateRad)

        // Apply flip and mirror
        ctx.scale(
          transformations.mirror ? -1 : 1,
          transformations.flip ? -1 : 1
        )

        // Draw image
        ctx.drawImage(img, -newWidth / 2, -newHeight / 2, newWidth, newHeight)

        // Reset transformation matrix
        ctx.setTransform(1, 0, 0, 1, 0, 0)

        // TODO: not working in real-time
        // Apply filters (grayscale)
        // if (transformations.filter === "grayscale") {
        //   const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
        //   const data = imageData.data
        //   for (let i = 0; i < data.length; i += 4) {
        //     const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
        //     data[i] = avg // R
        //     data[i + 1] = avg // G
        //     data[i + 2] = avg // B
        //   }
        //   ctx.putImageData(imageData, 0, 0)
        // }

        // Apply watermark
        if (transformations.watermark) {
          ctx.font = "32px Times New Roman"
          ctx.fillStyle = "rgba(255, 0, 0)"
          ctx.textBaseline = "top"
          ctx.fillText(
            transformations.watermark,
            newWidth - 100,
            newHeight - 40
          )
        }
      }
    }
  }, [transformations])

  useEffect(() => {
    if (image && imageRef.current) {
      imageRef.current.onload = applyTransformationsToCanvas
      imageRef.current.src = image.imageUrl!
    }
  }, [image, applyTransformationsToCanvas])

  useEffect(() => {
    if (image) {
      applyTransformationsToCanvas()
    }
  }, [image, applyTransformationsToCanvas])

  const applyTransformations = async () => {
    try {
      const response = await fetch(`/api/images/${id}/transform`, {
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
        toast.success("Transformations applied!")
        router.push(`/gallery`)
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
