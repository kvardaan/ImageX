import { Menu, Home, Settings, Images } from "lucide-react";

import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { auth } from "@/auth";
import { SideBarItem } from "@/components/sideBarItem";
import { LogoutButton } from "@/components/auth/logoutButton";
import { ProfileButton } from "@/components/protected/profileButton";

export const SideModal = async () => {
  const session = await auth();

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Menu />
        </SheetTrigger>
        <SheetContent className="w-2/3 sm:w-1/3 dark:bg-black dark:border-white/25 flex flex-col items-center justify-between dark:text-white/50">
          <section className="w-full flex flex-col items-center gap-4">
            <SheetHeader className="flex flex-col items-center gap-2 pt-4">
              <SheetTitle className="dark:text-white/75">ImageX</SheetTitle>
              <ProfileButton />
            </SheetHeader>
            {session && (
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
            )}
          </section>
          <LogoutButton />
        </SheetContent>
      </Sheet>
    </div>
  );
};
