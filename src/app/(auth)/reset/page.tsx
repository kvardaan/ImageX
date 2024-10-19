import { Metadata } from "next"

import { ResetForm } from "@/components/auth/forms/resetForm"

export const metadata: Metadata = { title: "Reset Password" }

export default function Page() {
  return <ResetForm />
}
