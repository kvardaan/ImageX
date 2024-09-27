const _config = {
  route: process.env.ROUTE,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV,
  redisHost: process.env.REDIS_SOCKET_HOST,
  redisPort: process.env.REDIS_PORT,
  resendApiKey: process.env.RESEND_API_KEY,
  redisPassword: process.env.REDIS_PASSWORD,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleSecretKey: process.env.GOOGLE_SECRET_KEY,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubSecretKey: process.env.GITHUB_SECRET_KEY,
};

export const config = Object.freeze(_config);