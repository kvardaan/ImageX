import { config } from "@/lib/utils/config";

export const getPublicUrl = (key: string) => {
  return `https://s3.${config.awsS3Region}.amazonaws.com/${config.awsS3UserBucketName}/${key}`;
}