import prisma from '@/core/infra/prisma'
import { IoredisService } from '@/core/infra/ioredis/ioredis-service'
import { Prisma } from '@/core/infra/prisma/generated/client'

type KeyTokenSelect = Prisma.KeyTokenSelect

type Session = {
  refreshToken: string
  userAgent: string
  ipAddress: string
  createdAt: string
  expiresAt: string
  revoked: boolean
}

export class KeyTokenRepository {
  private readonly redis = new IoredisService()

  private async ensureRedisConnected() {
    await this.redis.connect()
  }

  async findOneById<TSelect extends KeyTokenSelect | undefined>(
    id: string,
    options?: { select?: TSelect },
  ) {
    return prisma.keyToken.findFirst({
      where: { id },
      ...options,
    })
  }

  async findOneByUserId<TSelect extends KeyTokenSelect | undefined>(
    userId: string,
    options?: { select?: TSelect },
  ) {
    return prisma.keyToken.findFirst({
      where: { userId },
      ...options,
    })
  }

  async findManyByFilter<TSelect extends KeyTokenSelect | undefined>(
    where: Prisma.KeyTokenWhereInput,
    options?: { select?: TSelect },
  ) {
    return prisma.keyToken.findMany({
      where,
      ...options,
    })
  }

  async createOne<TSelect extends KeyTokenSelect | undefined>(
    data: Prisma.KeyTokenCreateInput,
    options?: { select?: TSelect },
  ) {
    return prisma.keyToken.create({
      data,
      ...options,
    })
  }

  async updateOneById<TSelect extends KeyTokenSelect | undefined>(
    id: string,
    data: Prisma.KeyTokenUpdateInput,
    options?: { select?: TSelect },
  ) {
    return prisma.keyToken.update({
      where: { id },
      data,
      ...options,
    })
  }

  async updateRefreshTokenById(id: string, refreshToken: string): Promise<boolean> {
    const { count } = await prisma.keyToken.updateMany({
      where: { id },
      data: { refreshToken },
    })
    return count > 0
  }

  async deleteById(id: string): Promise<boolean> {
    const deleted = await prisma.keyToken.delete({ where: { id } }).catch(() => null)
    return Boolean(deleted)
  }

  async deleteByUserId(userId: string): Promise<boolean> {
    const deleted = await prisma.keyToken.deleteMany({ where: { userId } }).catch(() => null)
    return Boolean(deleted)
  }

  async deleteManyByFilter(where: Prisma.KeyTokenWhereInput): Promise<boolean> {
    const deleted = await prisma.keyToken.deleteMany({ where })
    return deleted.count > 0
  }

  async hasUsedRefreshToken(keyTokenId: string, token: string): Promise<boolean> {
    const row = await prisma.usedRefreshToken.findUnique({
      where: {
        keyTokenId_token: { keyTokenId, token },
      },
      select: { id: true },
    })
    return Boolean(row)
  }

  async recordUsedRefreshToken(keyTokenId: string, token: string) {
    return prisma.usedRefreshToken.create({
      data: { keyTokenId, token },
    })
  }

  async saveSessionToRedis(userId: string, sessionData: Session): Promise<void> {
    await this.ensureRedisConnected()
    const key = `user_sessions:${userId}`
    const sessionId = `session:${Date.now()}`
    await this.redis.hset(key, sessionId, JSON.stringify(sessionData))
    await this.redis.setExpire(key, 3 * 24 * 60 * 60)
  }
}
