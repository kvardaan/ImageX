import Image from "next/image";

import { auth } from "@/auth";

export const UserProfile = async () => {
  const session = await auth();

  return (
    <div className="flex flex-row items-center justify-center">
      <p>{session?.user.name}</p>
      {session?.user.profileUrl && (
        <Image
          src={String(session?.user.profileUrl)}
          alt={`${String(session?.user.name)}'s Profile`}
          width={50}
          height={50}
          className="hidden md:flex"
        />
      )}
    </div>
  );
};
