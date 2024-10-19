import { Metadata } from "next"

import { auth } from "@/lib/auth"
import { fetchImages } from "@/lib/data/images"
import { Heading } from "@/components/heading"
import { GalleryCard } from "@/components/dashboard/gallery/galleryCard"

export const metadata: Metadata = { title: "Gallery" }

export default async function Page() {
  const session = await auth()
  const images = await fetchImages(session?.user.id as string)

  return (
    <div className="rounded-md p-2 text-clip w-full bg-gray-50 dark:bg-white/10">
      <Heading title="Gallery" />
      <div className="w-full mt-4">
        <GalleryCard images={images} />
      </div>
    </div>
  )
}
