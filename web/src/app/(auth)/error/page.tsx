import { Metadata } from "next";

import { ErrorCard } from "@/components/auth/errorCard";

export const metadata: Metadata = { title: "Error" };

const Page = () => {
  return <ErrorCard />;
};

export default Page;
