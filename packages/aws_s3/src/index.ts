import { configDotenv } from "dotenv";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { S3Client, GetObjectCommand, PutObjectCommand, NoSuchKey, S3ServiceException } from "@aws-sdk/client-s3"

configDotenv({ path: "../../.env" });

const s3Client = new S3Client({
  region: String(process.env.AWS_S3_REGION),
  credentials: {
    accessKeyId: String(process.env.AWS_S3_ACCESS_KEY_ID),
    secretAccessKey: String(process.env.AWS_S3_SECRET_ACCESS_KEY),
  },
});

/**
 * Creates a presigned URL for downloading an object from Amazon S3.
 */
export const createPresignedGetURL = async (bucketName: string, key: string) => {
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
      return { error: `Error fetching object! ${error.name}: ${JSON.stringify(error.message)}` }
    } else {
      return { error: `Something went wrong! ${JSON.stringify(error)}` }
    }
  }
}

/**
 * Creates a presigned URL for uploading an object to Amazon Simple Storage Service (Amazon S3).
 */
export const createPresignedPutURL = async (bucketName: string, fileName: string, contentType: string, body: any) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    ContentType: contentType,
  })

  try {
    const signedUrl = await getSignedUrl(s3Client, command)
    return signedUrl
  } catch (error) {
    if (error instanceof S3ServiceException) {
      return { error: `Error uploading object! ${error.name}: ${JSON.stringify(error.message)}` }
    } else {
      return { error: `Something went wrong! ${JSON.stringify(error)}` }
    }
  }
}