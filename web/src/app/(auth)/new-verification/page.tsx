import { Metadata } from "next";

import { NewVerificationForm } from "@/components/auth/newVerificationForm";

export const metadata: Metadata = { title: "Verify Account" };

export default function Page() {
  return <NewVerificationForm />;
}
