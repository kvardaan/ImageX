import { Metadata } from "next"

import { EditImage } from "@/components/protected/gallery/edit/editImage"

export const metadata: Metadata = { title: "Edit Image" }

export default function Page({ params }: { params: { id: number } }) {
  return (
    <div className="rounded-md p-2 text-clip w-full bg-gray-50 dark:bg-white/10">
      <div className="w-full">
        <div className="w-full flex flex-col gap-y-2">
          <EditImage id={params.id} />
        </div>
      </div>
    </div>
  )
}
