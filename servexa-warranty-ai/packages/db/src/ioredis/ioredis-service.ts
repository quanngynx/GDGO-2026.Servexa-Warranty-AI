import { env } from '@servexa-warranty-ai/env/server';
import type { RedisClient } from './ioredis-provider';
import Redis, { type RedisKey } from 'ioredis';
import { redisOptionsLocal } from './ioredis-option-local';

export class IoredisService {
  constructor(private client?: RedisClient) {}

  async connect() {
    if (this.client) return;

    const nodeEnv = env.NODE_ENV;
    const host = env.REDIS_HOST || '127.0.0.1';
    const port = env.REDIS_PORT || 6379;
    // const password = env.REDIS_PASSWORD || '';
    // const username = env.REDIS_USERNAME || '';

    const options = redisOptionsLocal({ host, port, node_env: nodeEnv});

    const client = new Redis(options);

    // Handling when redis server is down and the application starts
    client.on('error', function (e) {
      console.error(`REDIS: Error connecting: "${e}"`);
    });

    try {
      await client?.connect?.();
      this.client = client;
    } catch (error) {
      console.error(`REDIS: Failed to connect: ${error}`);
    }
  }

  private getClient(): RedisClient {
    if (!this.client) {
      throw new Error('REDIS: Client not initialized. Call connect() first.');
    }
    return this.client;
  }

  async set(key: string, value: string, expirationSeconds: number) {
    await this.getClient().set(key, value, 'EX', expirationSeconds);
  }

  async hset(key: RedisKey, field: string | Buffer | number, value: string) {
    await this.getClient().hset(key, field, value);
  }

  async get(key: string): Promise<string | null> {
    return await this.getClient().get(key);
  }

  async findAllByPattern(pattern: string): Promise<string[] | null> {
    return await this.getClient().keys(pattern);
  }

  async delete(...keys: string[]): Promise<number> {
    return await this.getClient().del(...keys);
  }

  async existsOne(key: string): Promise<number> {
    return await this.getClient().exists(key);
  }

  async existsMany(...keys: string[]): Promise<number> {
    return await this.getClient().exists(...keys);
  }

  async getTTL(key: string): Promise<number> {
    return await this.getClient().ttl(key);
  }

  async incrementOne(key: string): Promise<number> {
    return await this.getClient().incr(key);
  }

  async setExpire(key: string, expirationSeconds: number): Promise<number> {
    return await this.getClient().expire(key, expirationSeconds);
  }
}
