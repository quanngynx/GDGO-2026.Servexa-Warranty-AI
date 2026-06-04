import { IoredisService } from "@/core/infra/ioredis/ioredis-service";
import { KEY_CACHE } from '@/core/constants/key-cache.constant'

export class PermissionCacheService {
  readonly TTL_SECONDS = 5 * 60 // 5 minutes

  private readonly redis: IoredisService

  constructor() {
    this.redis = new IoredisService()
  }

  private cacheKey(userId: string): string {
    return `${KEY_CACHE.USER_PERMISSIONS}:${userId}`
  }

  private async ensureConnected(): Promise<void> {
    await this.redis.connect()
  }

  async get(userId: string): Promise<string[] | null> {
    await this.ensureConnected()
    const raw = await this.redis.get(this.cacheKey(userId))
    if (!raw) return null
    return JSON.parse(raw) as string[]
  }

  async set(userId: string, permissions: string[]): Promise<void> {
    await this.ensureConnected()
    await this.redis.set(
      this.cacheKey(userId),
      JSON.stringify(permissions),
      this.TTL_SECONDS,
    )
  }

  async delete(userId: string): Promise<void> {
    await this.ensureConnected()
    await this.redis.delete(this.cacheKey(userId))
  }

  /**
   * Nuke all cached permission entries.
   * Used when role hierarchy or role-permission assignments change
   * and it is not feasible to determine which users are affected.
   */
  async deleteAll(): Promise<void> {
    await this.ensureConnected()
    const pattern = `${KEY_CACHE.USER_PERMISSIONS}:*`
    const keys = await this.redis.findAllByPattern(pattern)
    if (keys && keys.length > 0) {
      await this.redis.delete(...keys)
    }
  }
}
