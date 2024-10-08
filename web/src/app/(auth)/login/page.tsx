import { Metadata } from "next";

import { LoginForm } from "@/components/auth/loginForm";

export const metadata: Metadata = { title: "Login" };

export default function Page() {
  return <LoginForm />;
}
