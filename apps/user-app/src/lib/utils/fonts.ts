import { Poppins } from "next/font/google";
import { NextFont } from "next/dist/compiled/@next/font";

export const poppins: NextFont = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});