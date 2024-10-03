import { Metadata } from "next";

import { auth } from "@/auth";
import { Heading } from "@/components/heading";
import { UserProfile } from "@/components/protected/profile/userProfile";

export const metadata: Metadata = { title: "Profile" };

export interface UserType {
  user: {
    id?: string;
    name: string;
    email: string;
    isOAuth: boolean;
    profileUrl: string;
  };
}

export default async function Page() {
  const session = await auth();
  const user: UserType | any = session?.user;

  return (
    <div className="rounded-md p-2 text-clip w-full overflow-y-auto bg-gray-50 dark:bg-white/10">
      <Heading title="Profile" />
      <div className="w-full gap-2 mt-2">
        <UserProfile user={user} />
      </div>
    </div>
  );
}
