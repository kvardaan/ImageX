import Image from "next/image";
import { User } from "lucide-react";

import { auth } from "@/auth";

export const ProfileButton = async () => {
  const session = await auth();

  return (
    <div className="flex flex-row items-center justify-center gap-x-3">
      <p className="font-semibold">{session?.user.name}</p>
      <div className="w-10 h-10 rounded-lg border flex items-center justify-center bg-gray-200">
        {session?.user.profileUrl ? (
          <Image
            src={String(session?.user.profileUrl)}
            alt={`${String(session?.user.name)}'s Profile`}
            width={50}
            height={50}
            className="hidden md:flex"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-[80%] h-[80%] flex items-center justify-center dark:text-black" />
          </div>
        )}
      </div>
    </div>
  );
};
