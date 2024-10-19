import { Metadata } from "next"

import { Heading } from "@/components/heading"
import { GalleryCard } from "@/components/dashboard/gallery/galleryCard"

export const metadata: Metadata = { title: "Gallery" }

export default function Page() {
  return (
    <div className="rounded-md p-2 text-clip w-full bg-gray-50 dark:bg-white/10">
      <Heading title="Gallery" />
      <div className="w-full mt-4">
        <GalleryCard />
      </div>
    </div>
  )
}
