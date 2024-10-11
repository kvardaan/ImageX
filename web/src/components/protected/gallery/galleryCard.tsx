"use client"

import { toast } from "sonner"
import { useState, useEffect } from "react"
import { PlusCircle, ImageOff } from "lucide-react"

import { ImageType } from "@/lib/types/image"
import { Button } from "@/components/ui/button"
import { AddImage } from "@/components/protected/gallery/addImage"
import { ImageCard } from "@/components/protected/gallery/imageCard"

export const GalleryCard = () => {
  const [images, setImages] = useState<ImageType[] | null>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchImages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("api/images")
      const data = await response.json()

      setImages(data)
      setIsLoading(false)
    } catch {
      toast.error("Error fetching images!")
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  return (
    <div className="w-full flex flex-col gap-y-2">
      {/* Add Image Button */}
      <div className="flex flex-row items-center sm:items-end justify-center sm:justify-end">
        <AddImage>
          <Button variant="default">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Image
          </Button>
        </AddImage>
      </div>

      {/* Images */}
      <div className="min-h-[425px] flex flex-col items-center justify-center gap-y-2 bg-white dark:bg-black/50 border dark:border-white/25 rounded-lg">
        {images?.length === 0 ? (
          <div className="text-center py-10 leading-8">
            <ImageOff className="mx-auto h-12 w-12" />
            <h3 className="mt-2 text-md font-medium">No images</h3>
            <p className="mt-1 text-sm font-light text-black/50 dark:text-white/50">
              Get started by adding a new image.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-2">
            {images &&
              images.map((image) => <ImageCard key={image.id} image={image} />)}
          </div>
        )}
      </div>
    </div>
  )
}
