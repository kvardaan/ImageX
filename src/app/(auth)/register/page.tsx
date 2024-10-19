import { Metadata } from "next"

import { RegisterForm } from "@/components/auth/forms/registerForm"

export const metadata: Metadata = { title: "Register" }

export default function Page() {
  return <RegisterForm />
}
