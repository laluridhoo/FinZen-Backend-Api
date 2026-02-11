import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = ["PORT", "DATABASE_URL"] as const;

const validateEnv = (): void => {
  const missing: string[] = [];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};

validateEnv();

export const env = {
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL!,
  nodeEnv: process.env.NODE_ENV || "development",
} as const;
