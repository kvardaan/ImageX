import { saveAs } from "file-saver"
import { Download } from "lucide-react"

import { Image } from "@/lib/types/image"
import { Button } from "@/components/ui/button"

interface ImageCardProps {
  key: number
  image: Image
}

function formatImageMetadata(metadata: string) {
  let { fileSize, fileType }: { fileSize: number; fileType: string } =
    JSON.parse(metadata)
  const fileSizeInBytes = fileSize
  const fileSizeInKb = fileSizeInBytes / 1024
  const fileSizeInMb = fileSizeInKb / 1024

  const fileSizeString =
    fileSizeInMb >= 1
      ? `${fileSizeInMb.toFixed(2)} MB`
      : fileSizeInKb >= 1
        ? `${fileSizeInKb.toFixed(2)} KB`
        : `${fileSizeInBytes} bytes`

  fileType = fileType.replace("image/", "")

  return { fileSize: fileSizeString, fileType }
}

export const ImageCard = ({ key, image }: ImageCardProps) => {
  const { fileSize, fileType } = formatImageMetadata(
    JSON.stringify(image.metadata)
  )

  const downloadImage = () => {
    saveAs(image.userId)
  }

  return (
    <div className="rounded-md group/image hover:shadow-lg transition duration-200 shadow-input dark:shadow-white/25 p-4 dark:bg-black bg-white dark:border-white/25 border justify-between flex flex-col">
      <img
        key={key}
        src={image.imageUrl as string}
        alt={image.id.toString()}
        className="rounded-md aspect-square object-contain group-hover/image:scale-105 group-hover/image:ease-in-out group-hover/image:duration-300"
      />
      <div className="flex items-center justify-between border-t pt-3">
        <div className="flex flex-col gap-y-2">
          <p>Size: {fileSize}</p>
          <p>Type: {fileType}</p>
        </div>
        <Button
          variant="ghost"
          className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300"
          onClick={downloadImage}
        >
          <Download />
        </Button>
      </div>
    </div>
  )
}
