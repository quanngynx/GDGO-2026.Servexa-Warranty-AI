import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export type EnvServer = Readonly<{
  PORT: number;
  DATABASE_URL: string;
  CORS_ORIGIN: string;
  CORS_ORIGIN_WEB: string;
  NODE_ENV: "development" | "production" | "test";

  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_USERNAME?: string | undefined;
  REDIS_PASSWORD?: string | undefined;
  REDIS_DB: number;

  TEMP_REFRESH_TOKEN_SECRET: string;
  PUBLIC_KEY_TYPE: "spki" | "pkcs1";

  BRANDING_NAME: string;
}>;

export const env = createEnv({
  server: {
    PORT: z.coerce.number().int().positive(),
    DATABASE_URL: z.string().min(1),
    CORS_ORIGIN: z.url(),
    CORS_ORIGIN_WEB: z.string(),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),

    REDIS_HOST: z.string().default("localhost"),
    REDIS_PORT: z.coerce.number().int().positive().default(6379),
    REDIS_USERNAME: z.string().optional(),
    REDIS_PASSWORD: z.string().optional(),
    REDIS_DB: z.coerce.number().int().positive().default(0),

    TEMP_REFRESH_TOKEN_SECRET: z.string().min(1),
    PUBLIC_KEY_TYPE: z.enum(['spki', 'pkcs1']).default('pkcs1'),

    BRANDING_NAME: z.string().min(1).default("Servexa Warranty AI"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
