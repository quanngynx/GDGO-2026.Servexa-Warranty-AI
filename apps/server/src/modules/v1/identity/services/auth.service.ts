import bcrypt from 'bcrypt'
import crypto from 'node:crypto'

import { Roles } from '@/enums/roles'
import { RolesScope } from '@/enums/roles-scope'
import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant'
import { KeyTokenService } from '@/core/services/key-token.service'
import { createOperationalError } from '@/middlewares/error-middleware'
import type { AccessTokenPayload, RefreshTokenPayload } from '@/types/jwt'

import type { RequestAuthLoginDto, ResponseAuthLoginDto } from '../dtos/auth-login.dto'
import { KeyTokenRepository } from '../repositories/key-token.repository'
import { UserRepository } from '../repositories/user.repository'

type LoginUser = {
  id: string
  username: string
  fullName: string
  companyEmail: string | null
  personalEmail: string | null
  password: string
  role: {
    name: string
  }
}

type RefreshUser = Omit<LoginUser, 'password'>

export class AuthService {
  private readonly keyTokenService: KeyTokenService
  private readonly keyTokenRepository: KeyTokenRepository
  private readonly userRepository: UserRepository

  constructor() {
    this.keyTokenService = new KeyTokenService()
    this.keyTokenRepository = new KeyTokenRepository()
    this.userRepository = new UserRepository()
  }

  async login(
    body: RequestAuthLoginDto,
    userAgent: string,
    ipAddress: string,
  ): Promise<ResponseAuthLoginDto> {
    const foundUser = await this.userRepository.findOneByUsername(
      body.username,
      {
        select: {
          id: true,
          username: true,
          fullName: true,
          companyEmail: true,
          personalEmail: true,
          password: true,
          deletedAt: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      },
    ) as (LoginUser & { deletedAt: Date | null }) | null

    if (!foundUser) {
      throw createOperationalError('User not found', HTTP_RESPONSE_CODE.BAD_REQUEST)
    }

    if (foundUser.deletedAt) {
      throw createOperationalError('User not found', HTTP_RESPONSE_CODE.BAD_REQUEST)
    }

    const effectiveEmail = foundUser.companyEmail ?? foundUser.personalEmail
    if (!effectiveEmail) {
      throw createOperationalError(
        'User email is not configured',
        HTTP_RESPONSE_CODE.BAD_REQUEST,
      )
    }

    const isMatch = await bcrypt.compare(body.password, foundUser.password)
    if (!isMatch) {
      throw createOperationalError(
        'Authentication error',
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
      )
    }

    const temporaryRefreshToken = this.keyTokenService.getTempRefreshTokenSecret()
    const keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
    })

    const role = Object.values(Roles).includes(foundUser.role.name as Roles)
      ? (foundUser.role.name as Roles)
      : Roles.USER

    const { publicKey, keyStoreId } = await this.keyTokenService.createKeyToken({
      userId: foundUser.id,
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey,
      refreshToken: temporaryRefreshToken,
    })

    const accessPayload: AccessTokenPayload = {
      id: foundUser.id,
      email: effectiveEmail,
      username: foundUser.username,
      fullName: foundUser.fullName,
      role,
      roleScope: RolesScope.SYSTEM,
      permissions: [],
      aud: 'access:common',
    }

    const refreshPayload: RefreshTokenPayload = {
      id: foundUser.id,
      email: effectiveEmail,
      keyStoreId,
      sessionId: '',
      aud: 'refresh:common',
    }

    const tokens = await this.keyTokenService.createTokenPair(
      accessPayload,
      refreshPayload,
      publicKey,
      keyPair.privateKey,
      userAgent,
      ipAddress,
    )

    await this.keyTokenRepository.updateRefreshTokenById(
      keyStoreId,
      tokens.refreshToken,
    )

    const nowSec = Math.floor(Date.now() / 1000)

    return {
      user: {
        id: foundUser.id,
        username: foundUser.username,
        fullName: foundUser.fullName,
        email: effectiveEmail,
        role: foundUser.role.name,
        permissions: [],
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresInAccessToken: Math.max(1, tokens.exp_accessToken - nowSec),
      expiresInRefreshToken: Math.max(1, tokens.exp_refreshToken - nowSec),
    }
  }

  async logout(input: {
    userId: string
    keyStoreId: string
    accessToken: string
  }): Promise<boolean> {
    const { userId, keyStoreId, accessToken } = input
    if (!userId || !keyStoreId || !accessToken) {
      throw createOperationalError(
        'Authentication required',
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
      )
    }

    const deleted = await this.keyTokenService.removeKeyById(keyStoreId)
    await this.keyTokenService.deleteKeyStoreCache(userId)

    const decoded = this.keyTokenService.decodeJWT<AccessTokenPayload>(accessToken)
    const exp = decoded.exp ?? 0
    const ttl = exp - Math.floor(Date.now() / 1000)
    if (ttl > 0) {
      await this.keyTokenService.addTokenToBlacklist(accessToken, ttl)
    }

    return deleted
  }

  async handleRefreshToken(input: {
    keyStoreId: string
    userId: string
    email: string
    refreshToken: string
    userAgent: string
    ipAddress: string
  }): Promise<ResponseAuthLoginDto> {
    const {
      keyStoreId,
      userId,
      email,
      refreshToken,
      userAgent,
      ipAddress,
    } = input

    const keyStoreData = await this.keyTokenRepository.findOneById(keyStoreId, {
      select: {
        id: true,
        refreshToken: true,
        publicKey: true,
        privateKey: true,
      },
    })

    if (!keyStoreData) {
      throw createOperationalError('Key store not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    const wasUsed = await this.keyTokenRepository.hasUsedRefreshToken(
      keyStoreData.id,
      refreshToken,
    )
    if (wasUsed) {
      await this.keyTokenService.deleteKeyByUserId(userId)
      throw createOperationalError(
        'Refresh token was already used',
        HTTP_RESPONSE_CODE.FORBIDDEN,
      )
    }

    if (keyStoreData.refreshToken !== refreshToken) {
      throw createOperationalError(
        'Refresh token mismatch',
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
      )
    }

    const foundUser = await this.userRepository.findOneById(userId, {
      select: {
        id: true,
        username: true,
        fullName: true,
        companyEmail: true,
        personalEmail: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    }) as RefreshUser | null

    if (!foundUser) {
      throw createOperationalError('User not found', HTTP_RESPONSE_CODE.NOT_FOUND)
    }

    const effectiveEmail = foundUser.companyEmail ?? foundUser.personalEmail
    if (!effectiveEmail || effectiveEmail !== email) {
      throw createOperationalError(
        'Invalid refresh token payload',
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
      )
    }

    const role = Object.values(Roles).includes(foundUser.role.name as Roles)
      ? (foundUser.role.name as Roles)
      : Roles.USER

    const accessPayload: AccessTokenPayload = {
      id: foundUser.id,
      email: effectiveEmail,
      username: foundUser.username,
      fullName: foundUser.fullName,
      role,
      roleScope: RolesScope.SYSTEM,
      permissions: [],
      aud: 'access:common',
    }

    const refreshPayload: RefreshTokenPayload = {
      id: foundUser.id,
      email: effectiveEmail,
      keyStoreId: keyStoreData.id,
      sessionId: '',
      aud: 'refresh:common',
    }

    const tokens = await this.keyTokenService.createTokenPair(
      accessPayload,
      refreshPayload,
      keyStoreData.publicKey,
      keyStoreData.privateKey,
      userAgent,
      ipAddress,
    )

    await this.keyTokenRepository.recordUsedRefreshToken(keyStoreData.id, refreshToken)
    await this.keyTokenRepository.updateOneById(keyStoreData.id, {
      refreshToken: tokens.refreshToken,
    })

    const nowSec = Math.floor(Date.now() / 1000)

    return {
      user: {
        id: foundUser.id,
        username: foundUser.username,
        fullName: foundUser.fullName,
        email: effectiveEmail,
        role: foundUser.role.name,
        permissions: [],
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresInAccessToken: Math.max(1, tokens.exp_accessToken - nowSec),
      expiresInRefreshToken: Math.max(1, tokens.exp_refreshToken - nowSec),
    }
  }
}