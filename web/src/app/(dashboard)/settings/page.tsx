import { Metadata } from "next"

import { Heading } from "@/components/heading"
import { SettingsContent } from "@/components/dashboard/settings/settingsContent"

export const metadata: Metadata = { title: "Settings" }

export default function Page() {
  return (
    <div className="rounded-md p-2 text-clip w-full bg-gray-50 dark:bg-white/10">
      <Heading title="Settings" />
      <div className="w-full gap-2 mt-4">
        <SettingsContent />
      </div>
    </div>
  )
}
