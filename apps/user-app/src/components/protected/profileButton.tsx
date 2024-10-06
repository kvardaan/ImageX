import Image from "next/image";
import { User } from "lucide-react";

import { currentUser } from "@/lib/utils/auth";

export const ProfileButton = async () => {
  const user = await currentUser();

  return (
    <div className="flex flex-row items-center justify-center gap-x-3">
      <p className="font-semibold">{user?.name}</p>
      <div className="w-10 h-10 rounded-lg border flex items-center justify-center bg-gray-200">
        {user?.profileUrl ? (
          <Image
            src={user?.profileUrl}
            alt={`${String(user?.name)}'s Profile`}
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
