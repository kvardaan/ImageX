const _config = {
  route: process.env.ROUTE,
  nodeEnv: process.env.NODE_ENV,
  resendApiKey: process.env.RESEND_API_KEY,
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  awsS3Region: process.env.AWS_S3_REGION,
  awsS3UserBucketName: process.env.USER_BUCKET_NAME,
  redisHost: process.env.REDIS_SOCKET_HOST || "localhost",
  redisPort: process.env.REDIS_PORT || 6379,
  redisPassword: process.env.REDIS_PASSWORD,
}

export const config = Object.freeze(_config)
