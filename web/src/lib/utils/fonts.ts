import { Lusitana, Poppins } from "next/font/google"
import { NextFont } from "next/dist/compiled/@next/font"

export const poppins: NextFont = Poppins({
  subsets: ["latin"],
  weight: ["400"],
})

export const lusitana: NextFont = Lusitana({
  subsets: ["latin"],
  weight: ["400"],
})
