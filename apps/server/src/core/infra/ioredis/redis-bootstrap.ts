import { IoredisService } from "./ioredis-service";

let bootstrapRedis: IoredisService | null = null;

export function getBootstrapRedis(): IoredisService | null {
  return bootstrapRedis;
}

export async function connectBootstrapRedis(): Promise<IoredisService> {
  const redis = new IoredisService();
  await redis.connect();
  bootstrapRedis = redis;
  return redis;
}
