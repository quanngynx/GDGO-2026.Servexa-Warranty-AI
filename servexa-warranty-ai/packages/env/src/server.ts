import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    CORS_ORIGIN: z.url(),
    CORS_ORIGIN_WEB: z.string(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

    BRANDING_NAME: z.string().min(1).default("Servexa Warranty AI"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
