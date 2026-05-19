import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/** `z.coerce.boolean()` treats the string `"false"` as true (`Boolean("false") === true`). */
const envBoolean = (defaultValue = false) =>
  z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => {
      if (val === undefined) return defaultValue;
      if (typeof val === "boolean") return val;
      const normalized = val.trim().toLowerCase();
      if (["true", "1", "yes", "on"].includes(normalized)) return true;
      if (["false", "0", "no", "off", ""].includes(normalized)) return false;
      return defaultValue;
    });

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

  /** When set (non-empty), ERP uses unary gRPC to Python AI runtime */
  AI_GRPC_HOST?: string | undefined;
  AI_GRPC_PORT: number;
  AI_GRPC_USE_TLS: boolean;
  AI_GRPC_DEADLINE_MS: number;
  AI_GRPC_API_KEY?: string | undefined;

  AI_STREAM_ANALYSIS: string;
  AI_STREAM_CHAT: string;
  AI_STREAM_REPORT: string;
  AI_STREAM_ANOMALY: string;
  AI_STREAM_RETRY: string;
  AI_STREAM_DLQ: string;
  /** Dedicated stream for async knowledge ingestion jobs. */
  AI_STREAM_INGEST: string;
  AI_STREAM_MAXLEN_APPROX: number;

  /** Shared secret for worker → server internal knowledge ingest webhook. */
  AI_INTERNAL_INGEST_SECRET?: string | undefined;

  AI_RAG_CONTEXT_ENABLED: boolean;
  AI_RAG_CONTEXT_TOP_K: number;

  TEMP_REFRESH_TOKEN_SECRET: string;
  PUBLIC_KEY_TYPE: "spki" | "pkcs1";

  BRANDING_NAME: string;
  LH_TOTAL_WAREHOUSE_NAME: string;

  OTEL_ENABLED: boolean;
  LANGFUSE_PUBLIC_KEY?: string | undefined;
  LANGFUSE_SECRET_KEY?: string | undefined;
  LANGFUSE_HOST?: string | undefined;

  HITL_PENDING_TTL_HOURS: number;

  /** Vercel AI SDK / @ai-sdk/google (Node fallback when gRPC is unavailable). */
  GOOGLE_GENERATIVE_AI_API_KEY?: string | undefined;
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

    AI_GRPC_HOST: z
      .string()
      .min(1)
      .optional()
      .describe("Python AiService gRPC host (omit to disable outbound gRPC)"),
    AI_GRPC_PORT: z.coerce.number().int().positive().default(50051),
    AI_GRPC_USE_TLS: envBoolean(false),
    AI_GRPC_DEADLINE_MS: z.coerce.number().int().positive().default(8000),
    AI_GRPC_API_KEY: z.string().optional().describe("Bearer token sent via gRPC metadata"),

    AI_STREAM_ANALYSIS: z.string().default("ai.analysis.stream"),
    AI_STREAM_CHAT: z.string().default("ai.chat.stream"),
    AI_STREAM_REPORT: z.string().default("ai.report.stream"),
    AI_STREAM_ANOMALY: z.string().default("ai.anomaly.stream"),
    AI_STREAM_RETRY: z.string().default("ai.retry.stream"),
    AI_STREAM_DLQ: z.string().default("ai.jobs.dlq"),
    AI_STREAM_INGEST: z.string().default("ai.ingest.stream"),
    AI_STREAM_MAXLEN_APPROX: z.coerce.number().int().positive().default(5000),

    AI_INTERNAL_INGEST_SECRET: z.string().min(8).optional(),

    /** When true, `completeUnaryPrompt` prepends top-k RAG snippets to the prompt (same DB as Prisma `ai_knowledge_*`). */
    AI_RAG_CONTEXT_ENABLED: envBoolean(false),
    AI_RAG_CONTEXT_TOP_K: z.coerce.number().int().positive().default(4),

    TEMP_REFRESH_TOKEN_SECRET: z.string().min(1),
    PUBLIC_KEY_TYPE: z.enum(['spki', 'pkcs1']).default('pkcs1'),

    BRANDING_NAME: z.string().min(1).default("Servexa Warranty AI"),
    LH_TOTAL_WAREHOUSE_NAME: z.string().min(1).default('Kho HCM Long Hậu'),

    /** When true, logs intent to wire OpenTelemetry (add SDK deps separately). */
    OTEL_ENABLED: envBoolean(false),
    /** Optional Langfuse project keys for future AI SDK telemetry wiring. */
    LANGFUSE_PUBLIC_KEY: z.string().optional(),
    LANGFUSE_SECRET_KEY: z.string().optional(),
    LANGFUSE_HOST: z.string().url().optional(),

    HITL_PENDING_TTL_HOURS: z.coerce.number().int().nonnegative().default(72),

    GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1).optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
