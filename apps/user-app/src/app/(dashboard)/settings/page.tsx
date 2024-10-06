import { Metadata } from "next";

import { Heading } from "@/components/heading";
import { currentUser } from "@/lib/utils/auth";
import { SettingsContent } from "@/components/protected/settings/settingsContent";

export const metadata: Metadata = { title: "Settings" };

// export interface UserType {
//   id?: string;
//   name: string;
//   email: string;
//   isOAuth: boolean;
//   profileUrl: string;
// }

export default async function Page() {
  const user = await currentUser();

  return (
    <div className="rounded-md p-2 text-clip w-full overflow-y-auto bg-gray-50 dark:bg-white/10">
      <Heading title="Settings" />
      <div className="w-full gap-2 my-2">
        <SettingsContent user={user} />
      </div>
    </div>
  );
}
