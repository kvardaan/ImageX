"use client";

import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { User } from "lucide-react";
import { StatusCodes } from "http-status-codes";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SettingsCard } from "@/components/protected/settings/settingsCard";
import { ChangeAvatar } from "@/components/protected/settings/changeAvatar";

export const SettingsContent = ({ user }: any) => {
  const [userName, setUserName] = useState(user.name);
  const [userProfileUrl, setUserProfileUrl] = useState<String>(
    user?.profileUrl
  );

  const handleNameChange = async () => {
    try {
      await axios.patch("api/users", {
        id: user.id,
        name: userName,
      });

      toast.success("User's name updated successfully!");
    } catch (error: any) {
      if (error?.status === StatusCodes.BAD_REQUEST)
        toast.error(error.response?.data?.error);
      else if (error.response.status === StatusCodes.INTERNAL_SERVER_ERROR)
        toast.error(error.response?.error);
    }
  };

  return (
    <div className="w-full p-2 h-fit flex flex-col items-center gap-y-2 bg-white dark:bg-black/50 border dark:border-white/25 rounded-lg">
      {/* Avatar */}
      <SettingsCard
        header="Avatar"
        flexDirection="row"
        description={
          <>
            This is your avatar.
            <br />
            Click on the avatar to upload a custom one from your files.
          </>
        }
        footer="An avatar is optional but strongly recommended."
        content={
          <div className="mt-4">
            <div className="flex items-center justify-center rounded-full w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 border dark:border-white/25 hover:opacity-90 hover:transition-opacity hover:duration-500 hover:cursor-pointer">
              <ChangeAvatar
                userId={user.id}
                setUserProfileUrl={setUserProfileUrl}
              >
                {userProfileUrl ? (
                  <img
                    src={user.profileUrl}
                    alt={`${user.name}'s Image`}
                    width={128}
                    height={128}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User className="w-10 h-10 sm:w-16 sm:h-16 text-gray-400" />
                )}
              </ChangeAvatar>
            </div>
          </div>
        }
      />

      {/* Name */}
      <SettingsCard
        header="Name"
        flexDirection="col"
        description="Please enter your full name, or a display name you are comfortable with."
        content={
          <>
            <Input
              className="w-1/2"
              name="name"
              id="name"
              placeholder="Enter name"
              defaultValue={user.name}
              onChange={(e) => setUserName(e.target.value)}
            />
          </>
        }
        footer={
          <span className="w-full flex items-center justify-between">
            <p>Please use 32 characters at maximum.</p>
            <Button type="submit" size="sm" onClick={handleNameChange}>
              Save
            </Button>
          </span>
        }
      />

      {/* Email */}
      <SettingsCard
        header="Email"
        flexDirection="col"
        description="Your email will be used for account-related notifications."
        content={
          <span className="w-fit md:w-1/2 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            {user.email}
          </span>
        }
      />
    </div>
  );
};
