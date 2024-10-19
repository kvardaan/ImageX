"use client"

import React, { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useApplicationStore } from "@/lib/store/appStore"

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const setUser = useApplicationStore((state) => state.setUser)

  useEffect(() => {
    if (session?.user) {
      const storeUser = {
        id: session.user.id as string,
        name: session.user.name as string,
        email: session.user.email as string,
        image: session.user.image,
        isOAuth: session.user.isOAuth,
        profileUrl: session.user.profileUrl,
      }

      setUser(storeUser)
    } else {
      setUser(null)
    }
  }, [session, setUser])

  return <>{children}</>
}
