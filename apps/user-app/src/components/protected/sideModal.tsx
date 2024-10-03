import {
  Menu,
  Home,
  Handshake,
  PlusCircle,
  ArrowLeftRight,
  User,
} from "lucide-react";

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
import { UserProfile } from "@/components/protected/userProfile";

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
              <UserProfile />
            </SheetHeader>
            {session && (
              <div className="w-full sm:w-2/3 flex flex-col justify-center items-center gap-x-2 gap-y-3">
                <SideBarItem
                  href="/"
                  title="Overview"
                  icon={<Home className="w-4 h-4" />}
                />
                <SideBarItem
                  href="/"
                  title="Add Money"
                  icon={<PlusCircle className="w-4 h-4" />}
                />
                <SideBarItem
                  href="/"
                  title="Transactions"
                  icon={<ArrowLeftRight className="w-4 h-4" />}
                />
                <SideBarItem
                  href="/"
                  title="Transfer"
                  icon={<Handshake className="w-4 h-4" />}
                />
                <SideBarItem
                  href="/user-profile"
                  title="Profile"
                  icon={<User className="w-4 h-4" />}
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
