import { Metadata } from "next"

import { RegisterForm } from "@/components/auth/registerForm"

export const metadata: Metadata = { title: "Register" }

export default function Page() {
  return <RegisterForm />
}
