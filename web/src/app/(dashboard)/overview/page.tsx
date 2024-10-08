import { Metadata } from "next"

import { Heading } from "@/components/heading"

export const metadata: Metadata = { title: "Overview" }

export default function Page() {
  return (
    <div className="rounded-md p-2 text-clip w-full bg-gray-50 dark:bg-white/10">
      <Heading title="Overview" />
      <div className="w-full gap-2 mt-4"></div>
    </div>
  )
}
