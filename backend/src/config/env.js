import dotenv from "dotenv";

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: toNumber(process.env.PORT, 5000),

  databaseUrl: process.env.DATABASE_URL || "",

  jwt: {
    secret: process.env.JWT_SECRET || "change-this-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    refreshSecret:
      process.env.JWT_REFRESH_SECRET ||
      process.env.JWT_SECRET ||
      "change-this-refresh-secret-in-production",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  app: {
    name: process.env.APP_NAME || "ConWise API",
    clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
    apiBaseUrl: process.env.API_BASE_URL || "http://localhost:5000/api",
  },

  verification: {
    codeLength: toNumber(process.env.VERIFICATION_CODE_LENGTH, 6),
    expiresInMinutes: toNumber(
      process.env.VERIFICATION_CODE_EXPIRES_MINUTES,
      10,
    ),
  },

  security: {
    bcryptSaltRounds: toNumber(process.env.BCRYPT_SALT_ROUNDS, 10),
  },
};

export default env;
