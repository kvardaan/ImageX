import { Metadata } from "next"

import { NewVerificationForm } from "@/components/auth/forms/newVerificationForm"

export const metadata: Metadata = { title: "Verify Account" }

export default function Page() {
  return <NewVerificationForm />
}
