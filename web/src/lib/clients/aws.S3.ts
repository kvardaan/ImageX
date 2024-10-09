import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  NoSuchKey,
  S3ServiceException,
} from "@aws-sdk/client-s3"

import { config } from "@/lib/utils/config"

const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"]

const maxFileSize = 1024 * 1024 * 5 // 5 MB

type GetSignedPutUrlParams = {
  bucketName: string
  fileName: string
  fileType: string
  fileSize: number
  checksum: string
}

type GetSignedPutUrlResponse = Promise<
  | { error?: undefined; signedUrl?: string }
  | { error?: string; signedUrl?: undefined }
>

const s3Client = new S3Client({
  region: String(config.awsS3Region),
  credentials: {
    accessKeyId: String(config.accessKeyId),
    secretAccessKey: String(config.secretAccessKey),
  },
})

/**
 * Creates a presigned URL for downloading an object from Amazon S3.
 */
export const createPresignedGetURL = async (
  bucketName: string,
  key: string
) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  })

  try {
    const signedUrl = await getSignedUrl(s3Client, command)
    return signedUrl
  } catch (error) {
    if (error instanceof NoSuchKey) {
      return { error: `No such key ${key} exists!` }
    } else if (error instanceof S3ServiceException) {
      return {
        error: `Error fetching object! ${error.name}: ${JSON.stringify(error.message)}`,
      }
    } else {
      return { error: `Something went wrong! ${JSON.stringify(error)}` }
    }
  }
}

/**
 * Creates a presigned URL for uploading an object to Amazon Simple Storage Service (Amazon S3).
 */
export const getSignedPutUrl = async ({
  bucketName,
  fileName,
  fileType,
  fileSize,
  checksum,
}: GetSignedPutUrlParams): Promise<GetSignedPutUrlResponse> => {
  if (!allowedFileTypes.includes(fileType)) {
    return { error: `File type ${fileType} is not supported!` }
  }

  if (fileSize > maxFileSize) {
    return { error: `File size is too large!` }
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
  })

  try {
    const signedUrl = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 60,
    })
    return { signedUrl }
  } catch (error) {
    if (error instanceof S3ServiceException) {
      return {
        error: `Error uploading object! ${error.name}: ${JSON.stringify(error.message)}`,
      }
    } else {
      return { error: `Something went wrong! ${JSON.stringify(error)}` }
    }
  }
}
