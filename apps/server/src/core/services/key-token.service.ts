import { IoredisService } from "@/core/infra/ioredis/ioredis-service";
import { env } from '@servexa-warranty-ai/env/server'
import JWT, { type JwtPayload, type VerifyErrors } from 'jsonwebtoken'

import { KEY_CACHE } from '@/core/constants/key-cache.constant'
import { VALUE_TOKEN } from '@/core/constants/token.constant'
import { createOperationalError } from '@/middlewares/error-middleware'
import { KeyTokenRepository } from '@/modules/v1/identity/repositories/key-token.repository'
import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant'
import type {
  AccessTokenPayload,
  KeyStoreForJWT,
  PairToken,
  RefreshTokenPayload,
} from '@/types/jwt'

type Session = {
  refreshToken: string
  userAgent: string
  ipAddress: string
  createdAt: string
  expiresAt: string
  revoked: boolean
}

export class KeyTokenService {
  private readonly keyTokenRepository: KeyTokenRepository
  private readonly redisService: IoredisService

  constructor() {
    this.keyTokenRepository = new KeyTokenRepository()
    this.redisService = new IoredisService()
  }

  private async ensureRedisConnected() {
    await this.redisService.connect()
  }

  async createKeyToken(input: {
    userId: string
    publicKey: string
    privateKey: string
    refreshToken: string
  }): Promise<{ publicKey: string; keyStoreId: string }> {
    const { userId, publicKey, privateKey, refreshToken } = input
    const existingRecords = await this.keyTokenRepository.findManyByFilter(
      { userId },
      { select: { id: true } },
    )

    if (existingRecords.length > 0) {
      await this.keyTokenRepository.deleteManyByFilter({ userId })
      await this.invalidateKeyStoreCache(userId)
    }

    const created = await this.keyTokenRepository.createOne({
      userId,
      publicKey,
      privateKey,
      refreshToken,
    })

    await this.updateKeyStoreCache(created)

    return {
      publicKey: created.publicKey,
      keyStoreId: created.id,
    }
  }

  async createTokenPair(
    payloadAT: AccessTokenPayload,
    payloadRT: RefreshTokenPayload,
    publicKey: string,
    privateKey: string,
    userAgent: string,
    ipAddress: string,
  ): Promise<PairToken> {
    const accessToken = JWT.sign(payloadAT, privateKey, {
      algorithm: 'RS256',
      expiresIn: '10h',
    })

    const refreshToken = JWT.sign(payloadRT, privateKey, {
      algorithm: 'RS256',
      expiresIn: '3d',
    })

    const decodedAccessToken = JWT.decode(accessToken) as AccessTokenPayload
    const decodedRefreshToken = JWT.decode(refreshToken) as RefreshTokenPayload

    JWT.verify(accessToken, publicKey, (err: VerifyErrors | null) =>
      this.verifyCallbackOption(err, decodedAccessToken),
    )

    const sessionData: Session = {
      refreshToken,
      userAgent,
      ipAddress,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + VALUE_TOKEN.MAX_AGE_REFRESH_TOKEN * 1000).toISOString(),
      revoked: false,
    }
    await this.keyTokenRepository.saveSessionToRedis(decodedAccessToken.id, sessionData)

    return {
      accessToken,
      refreshToken,
      iat_accessToken: decodedAccessToken.iat ?? 0,
      exp_accessToken: decodedAccessToken.exp ?? 0,
      iat_refreshToken: decodedRefreshToken.iat ?? 0,
      exp_refreshToken: decodedRefreshToken.exp ?? 0,
    }
  }

  verifyJWT(token: string, keySecret: string): string | JwtPayload {
    try {
      return JWT.verify(token, keySecret, {
        algorithms: ['RS256'],
      })
    } catch {
      throw createOperationalError(
        'Invalid token',
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
      )
    }
  }

  decodeJWT<T>(token: string): T {
    return JWT.decode(token) as T
  }

  validateToken<TDecoded extends { iat?: number }>(decoded: TDecoded, maxAge: number) {
    const now = Math.floor(Date.now() / 1000)
    const issuedAt = decoded.iat ?? 0
    if (now - issuedAt > maxAge) {
      throw createOperationalError(
        'Token expired',
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
      )
    }
  }

  async requireKeyStore(userId: string): Promise<KeyStoreForJWT> {
    const cacheKey = `${KEY_CACHE.KEY_STORE}:${userId}`
    await this.ensureRedisConnected()

    const cachedData = await this.redisService.get(cacheKey)
    if (cachedData) {
      return JSON.parse(cachedData) as KeyStoreForJWT
    }

    const keyStore = await this.findByUserId(userId)
    if (!keyStore) {
      throw createOperationalError(
        'Key store not found',
        HTTP_RESPONSE_CODE.NOT_FOUND,
      )
    }

    await this.redisService.set(cacheKey, JSON.stringify(keyStore), 60 * 60)
    return keyStore
  }

  async removeKeyById(keyTokenId: string): Promise<boolean> {
    return this.keyTokenRepository.deleteById(keyTokenId)
  }

  async findByUserId(userId: string): Promise<KeyStoreForJWT | null> {
    const keyStore = await this.keyTokenRepository.findOneByUserId(userId, {
      select: {
        id: true,
        privateKey: true,
        publicKey: true,
        refreshToken: true,
      },
    })

    if (!keyStore) {
      return null
    }

    return {
      id: keyStore.id,
      privateKey: keyStore.privateKey,
      publicKey: keyStore.publicKey,
      refreshToken: keyStore.refreshToken,
    }
  }

  async deleteKeyByUserId(userId: string): Promise<boolean> {
    const result = await this.keyTokenRepository.deleteByUserId(userId)
    await this.invalidateKeyStoreCache(userId)
    return result
  }

  async invalidateKeyStoreCache(userId: string): Promise<void> {
    const cacheKey = `${KEY_CACHE.KEY_STORE}:${userId}`
    await this.ensureRedisConnected()
    await this.redisService.delete(cacheKey)
  }

  async updateKeyStoreCache(keyStore: {
    id: string
    userId: string
    privateKey: string
    publicKey: string
    refreshToken: string
  }): Promise<void> {
    const cacheKey = `${KEY_CACHE.KEY_STORE}:${keyStore.userId}`
    await this.ensureRedisConnected()
    await this.redisService.set(cacheKey, JSON.stringify(keyStore), 60 * 60)
  }

  async deleteKeyStoreCache(userId: string): Promise<void> {
    await this.invalidateKeyStoreCache(userId)
  }

  async addTokenToBlacklist(token: string, ttl: number): Promise<void> {
    await this.ensureRedisConnected()
    await this.redisService.set(`${KEY_CACHE.BLACKLIST}:${token}`, 'true', ttl)
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    await this.ensureRedisConnected()
    const exists = await this.redisService.existsOne(`${KEY_CACHE.BLACKLIST}:${token}`)
    return exists > 0
  }

  getTempRefreshTokenSecret() {
    return env.TEMP_REFRESH_TOKEN_SECRET
  }

  verifyCallbackOption(err: VerifyErrors | null, decoded: JwtPayload | string | undefined) {
    if (err) {
      return
    }
    void decoded
  }
}
