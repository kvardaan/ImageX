import { Metadata } from "next"

import { Heading } from "@/components/heading"
import { EditImage } from "@/components/protected/gallery/edit/editImage"

export const metadata: Metadata = { title: "Edit Image" }

export default function Page({ params }: { params: { id: number } }) {
  return (
    <div className="rounded-md p-2 text-clip w-full bg-gray-50 dark:bg-white/10">
      <Heading title={`Image ${params.id}`} />
      <div className="w-full mt-4">
        <div className="w-full flex flex-col gap-y-2">
          <EditImage id={params.id} />
        </div>
      </div>
    </div>
  )
}
