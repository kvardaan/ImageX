"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import { cn } from "@/lib/utils";
import { poppins } from "@/lib/utils/fonts";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginButton } from "@/components/auth/loginButton";

export default function Home() {
  const session = useSession();
  if (session.data?.user) redirect("/overview");

  return (
    <main className="flex flex-col h-screen items-center justify-center">
      <div className="space-y-6 text-center">
        <ThemeToggle />
        <h1
          className={cn(
            "text-6xl font-semibold drop-shadow-md",
            poppins.className
          )}
        >
          ImageX
        </h1>
        <p className="text-xl">A simple image processing service</p>
        <div>
          <LoginButton>
            <Button variant="secondary" size="lg">
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
