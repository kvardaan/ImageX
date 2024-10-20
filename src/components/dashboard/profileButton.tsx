import { User } from "lucide-react"

import { auth } from "@/lib/auth"

export const ProfileButton = async () => {
  const session = await auth()
  const user = session?.user

  return (
    <div className="flex flex-row items-center justify-center gap-x-3">
      <p className="font-semibold">{user?.name}</p>
      <div className="w-10 h-10 rounded-lg border flex items-center justify-center bg-gray-200">
        {user?.image ? (
          <img
            src={user?.image}
            alt={`${String(user?.name)}'s Profile`}
            width={50}
            height={50}
            loading="lazy"
            className="hidden md:flex rounded-lg w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-[80%] h-[80%] flex items-center justify-center dark:text-black" />
          </div>
        )}
      </div>
    </div>
  )
}
