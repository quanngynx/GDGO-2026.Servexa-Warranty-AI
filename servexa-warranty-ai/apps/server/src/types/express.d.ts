
import 'express';

import { AccessTokenPayload } from '@repo/shared/bases/access-token-payload';
import { RefreshTokenPayload } from '@repo/shared/bases/refresh-token-payload';

import { TempTokenPayload } from '@/core/utils/temp-token.util';

import { KeyStoreForJWT } from './common';

declare global {
  namespace Express {
      interface Request {
        keyStore: KeyStoreForJWT;
        // For access token
	      user: AccessTokenPayload;
        // For refresh token
        refresh: RefreshTokenPayload;
        refreshToken?: string;

        // For logger
        requestId: string
        startTime: number

        // For api key
        apiKey: {
          keyId: string;
          owner: string;
          scopes: string[];
        };

        // For file
        file?: Express.Multer.File,

        // For rate limit
        rateLimitKey?: string
        tempTokenPayload?: TempTokenPayload
      }
  }
}
