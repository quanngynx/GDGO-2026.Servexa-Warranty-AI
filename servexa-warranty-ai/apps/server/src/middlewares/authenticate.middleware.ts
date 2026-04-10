import type { RequestHandler } from 'express'

import { AUTHORIZATION, CLIENT_ID } from '@/core/constants/headers'
import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant'
import { VALUE_TOKEN } from '@/core/constants/token.constant'
import { KeyTokenService } from '@/core/services/key-token.service'
import { createOperationalError } from '@/middlewares/error-middleware'
import { requireHeader } from '@/utils/require-header'
import type { AccessTokenPayload } from '@/types/jwt'
import { logger } from '@/core/logging'

const keyTokenService = new KeyTokenService()

const extractBearerToken = (authHeader: string) => {
  const [scheme, token] = authHeader.split(' ')
  if (scheme !== 'Bearer' || !token) {
    throw createOperationalError(
      'Invalid authorization header format',
      HTTP_RESPONSE_CODE.UNAUTHORIZED,
    )
  }
  return token
}

export const authenticateMiddleware: RequestHandler = async (req, _res, next) => {
  try {
    const userId = requireHeader(req, CLIENT_ID, 'Missing x-client-id')
    const authHeader = requireHeader(req, AUTHORIZATION, 'Missing authorization')
    const accessToken = extractBearerToken(authHeader)

    const blacklist = await keyTokenService.isTokenBlacklisted(accessToken)
    if (blacklist) {
      throw createOperationalError(
        'Token is blacklisted. Please login again.',
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
      )
    }

    const keyStore = await keyTokenService.requireKeyStore(userId)
    const decoded = keyTokenService.verifyJWT(
      accessToken,
      keyStore.publicKey,
    ) as AccessTokenPayload

    if (decoded.id !== userId) {
      throw createOperationalError(
        'Invalid client id',
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
      )
    }

    keyTokenService.validateToken(decoded, VALUE_TOKEN.MAX_AGE_ACCESS_TOKEN)

    req.keyStore = keyStore
    req.user = decoded

    next()
  } catch (error) {
    logger.error('Error authenticate', {
      error: error instanceof Error ? error.message : String(error),
    })
    next(error)
  }
}
