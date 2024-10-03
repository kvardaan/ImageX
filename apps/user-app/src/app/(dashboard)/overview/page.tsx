import { Metadata } from "next";

import { Heading } from "@/components/heading";

export const metadata: Metadata = { title: "Overview" };

export default function Page() {
  return (
    <div className="rounded-md p-2 text-clip w-full overflow-y-auto bg-gray-50 dark:bg-white/10">
      <Heading title="Overview" />
      <div className="flex flex-col lg:flex-row w-full gap-2 mt-4">
        <div className="w-full lg:w-2/5 flex flex-col gap-2"></div>
        <div className="w-full lg:w-3/5 flex flex-col gap-2"></div>
      </div>
    </div>
  );
}
