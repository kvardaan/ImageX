"use client";

import Image from "next/image";
import { User } from "lucide-react";

import { UserType } from "@/app/(dashboard)/profile/page";
import { ChangeAvatar } from "@/components/protected/profile/changeAvatar";

export const UserProfile = ({ user }: UserType) => {
  return (
    <div className="w-full flex flex-col sm:flex-row justify-center sm:justify-center g-2 bg-gray-100 dark:bg-black/50 border dark:border-white/25 rounded-lg">
      {/* Profile Image */}
      <div className="w-full sm:w-1/5 p-4 flex items-center justify-center">
        <div className="w-full h-full flex flex-col items-center gap-y-2 relative">
          <div className="flex flex-col items-center justify-center gap-x-3 w-32 h-32 bg-gray-200 rounded-full border dark:border-white/25">
            {user?.profileUrl ? (
              <Image
                src={user.profileUrl as string}
                alt={`${user.name}'s Image`}
                width={128}
                height={128}
                quality={100}
                className="object-cover rounded-full"
              />
            ) : (
              <User className="w-16 h-16 text-gray-400" />
            )}
          </div>
          <ChangeAvatar />
        </div>
      </div>

      <div className="flex flex-col m-2 p-2 w-[90%] sm:w-4/5 rounded-md bg-white/25 dark:bg-black/25 border dark:border-white/25">
        <p>{user?.name}</p>
        <p>{user?.email}</p>
      </div>
    </div>
  );
};
