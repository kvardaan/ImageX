import { Metadata } from "next";

import { ResetForm } from "@/components/auth/resetForm";

export const metadata: Metadata = { title: "Reset Password" };

const Page = () => {
  return <ResetForm />;
};

export default Page;
