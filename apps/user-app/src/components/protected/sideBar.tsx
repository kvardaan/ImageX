import { Home, Images, Settings } from "lucide-react";

import { SideBarItem } from "@/components/sideBarItem";
import { LogoutButton } from "@/components/auth/logoutButton";

export const SideBar = () => {
  return (
    <div
      id="sidebar"
      className="hidden lg:!flex flex-col justify-between w-40 gap-x-2"
    >
      <div className="w-full flex flex-col justify-center items-center gap-x-2 gap-y-3">
        <SideBarItem
          href="/"
          title="Overview"
          icon={<Home className="w-4 h-4" />}
        />
        <SideBarItem
          href="/gallery"
          title="Gallery"
          icon={<Images className="w-4 h-4" />}
        />
        <SideBarItem
          href="/settings"
          title="Settings"
          icon={<Settings className="w-4 h-4" />}
        />
      </div>
      <LogoutButton />
    </div>
  );
};
