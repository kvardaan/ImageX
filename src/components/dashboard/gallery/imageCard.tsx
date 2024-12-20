"use client"

import { toast } from "sonner"
import { saveAs } from "file-saver"
import { Download, EllipsisVertical } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Image } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { deleteImage } from "@/lib/actions/images"
import { formatImageMetadata } from "@/lib/utils/image"

interface ImageCardProps {
  image: Image
}

export const ImageCard = ({ image }: ImageCardProps) => {
  const router = useRouter()
  const { fileSize, fileType } = formatImageMetadata(
    JSON.stringify(image.metadata)
  )

  const downloadImage = async () => {
    const response = await fetch(image.imageUrl as string)
    const blob = await response.blob()
    saveAs(
      new Blob([blob], { type: `image/${fileType.toLowerCase()}` }),
      image.imageUrl?.split("/").pop()
    )
  }

  const editImage = async () => {
    router.push(`gallery/${image.id}`)
  }

  const removeImage = async () => {
    const response = await deleteImage(
      image.id,
      `${image.userId}/${image.imageUrl?.split("/").pop()}`
    )

    if (response && response.error) toast.error(response.error)
    else toast.success("Image deleted successfully!")
  }

  return (
    <div className="rounded-md flex flex-col justify-between group/image hover:shadow-lg transition duration-200 shadow-input dark:shadow-white/25 p-4 dark:bg-black bg-white dark:border-white/25 border text-black/50 dark:text-white/50 text-sm">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="ml-auto">
          <EllipsisVertical className="relative top-0 right-0 h-5 w-5 group-hover/image:text-black dark:group-hover/image:text-white" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit">
          <DropdownMenuCheckboxItem onClick={editImage}>
            Edit
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem onClick={removeImage}>
            Delete
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <img
        src={image.imageUrl as string}
        alt={image.id.toString()}
        className="rounded-md aspect-square object-contain"
      />
      <div className="flex items-center justify-between pt-3 group-hover/image:text-black dark:group-hover/image:text-white">
        <div className="flex flex-col gap-y-2">
          <p>Size: {fileSize}</p>
          <p>Type: {fileType}</p>
        </div>
        <Button
          variant="ghost"
          className="font-sans font-normal"
          onClick={downloadImage}
        >
          <Download />
        </Button>
      </div>
    </div>
  )
}
