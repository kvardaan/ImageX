import { Metadata } from "next"

import { Image } from "@prisma/client"
import { fetchImageWithId } from "@/lib/data/images"
import { EditImage } from "@/components/dashboard/gallery/edit/editImage"

export const metadata: Metadata = { title: "Edit Image" }

export default async function Page({ params }: { params: { id: number } }) {
  const image: Image | null = await fetchImageWithId(params.id)

  return (
    <div className="rounded-md p-2 text-clip w-full bg-gray-50 dark:bg-white/10">
      <div className="w-full">
        <div className="w-full flex flex-col gap-y-2">
          <EditImage id={params.id} image={image} />
        </div>
      </div>
    </div>
  )
}
