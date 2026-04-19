import type { RequestHandler } from 'express'

import { CLIENT_ID, REFRESHTOKEN } from '@/core/constants/headers'
import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant'
import { VALUE_TOKEN } from '@/core/constants/token.constant'
import { KeyTokenService } from '@/core/services/key-token.service'
import { createOperationalError } from '@/middlewares/error-middleware'
import { requireHeader } from '@/utils/require-header'
import type { RefreshTokenPayload } from '@/types/jwt'
import { logger } from '@/core/logging'

const keyTokenService = new KeyTokenService()

export const refreshAuthenticateMiddleware: RequestHandler = async (req, _res, next) => {
  try {
    const userId = requireHeader(req, CLIENT_ID, 'Missing x-client-id')
    const refreshToken = requireHeader(req, REFRESHTOKEN, 'Missing refreshtoken')

    const keyStore = await keyTokenService.requireKeyStore(userId)
    const decoded = keyTokenService.verifyJWT(
      refreshToken,
      keyStore.privateKey,
    ) as RefreshTokenPayload

    if (decoded.id !== userId) {
      throw createOperationalError(
        'Invalid client id',
        HTTP_RESPONSE_CODE.UNAUTHORIZED,
      )
    }

    keyTokenService.validateToken(decoded, VALUE_TOKEN.MAX_AGE_REFRESH_TOKEN)

    req.keyStore = keyStore
    req.refresh = decoded
    req.refreshToken = refreshToken

    next()
  } catch (error) {
    logger.error('Error refresh authenticate', {
      error: error instanceof Error ? error.message : String(error),
    })
    next(error)
  }
}
