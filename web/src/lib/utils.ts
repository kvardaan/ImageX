import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

import { config } from "@/lib/utils/config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a public URL for a given key in the user S3 bucket.
 */
export const getPublicUrl = (key: string) => {
  return `https://s3.${config.awsS3Region}.amazonaws.com/${config.awsS3UserBucketName}/${key}`
}

/**
 * Computes the SHA-256 hash of a given file.
 */
export const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

/**
 * Given a file name and a MIME type, returns a new file name with a file
 * extension based on the MIME type. For example, if the MIME type is
 * "image/jpeg", it will return "fileName.jpg".
 */
export const getFileNameWithFileType = (fileName: string, fileType: string) => {
  const fileExtension = fileType.split("/").pop()
  return `${fileName}.${fileExtension}`
}

/**
 * Given a URL, extracts the path without the file extension. For example,
 * given `https://example.com/path/to/file.txt`, it will return `path/to/file`.
 */
export const extractPathFromUrl = (url: string): string => {
  const parts = url.split("/");
  const lastPart = parts.pop();

  if (!lastPart) {
    throw new Error("Invalid URL: no filename found");
  }

  const filenameWithoutExtension = lastPart.replace(/\.[^/.]+$/, "");
  return `${parts.pop()}/${filenameWithoutExtension}`;
}