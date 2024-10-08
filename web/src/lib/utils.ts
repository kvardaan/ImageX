import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

import { config } from "@/lib/utils/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getPublicUrl = (key: string) => {
  return `https://s3.${config.awsS3Region}.amazonaws.com/${config.awsS3UserBucketName}/${key}`;
}

export const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}