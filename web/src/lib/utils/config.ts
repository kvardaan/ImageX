const _config = {
  route: process.env.ROUTE,
  nodeEnv: process.env.NODE_ENV,
  authSecret: process.env.AUTH_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleSecretKey: process.env.GOOGLE_SECRET_KEY,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubSecretKey: process.env.GITHUB_SECRET_KEY,
  resendApiKey: process.env.RESEND_API_KEY,
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  awsS3Region: process.env.AWS_S3_REGION,
  awsS3ProcessingBucketName: process.env.PROCESSING_BUCKET_NAME,
  awsS3UserBucketName: process.env.USER_BUCKET_NAME,
  redisHost: process.env.REDIS_SOCKET_HOST || "localhost",
  redisPort: process.env.REDIS_PORT || 6379,
  redisPassword: process.env.REDIS_PASSWORD,
};

export const config = Object.freeze(_config);