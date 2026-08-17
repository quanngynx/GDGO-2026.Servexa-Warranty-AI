
import 'express';

import type {
  AccessTokenPayload,
  KeyStoreForJWT,
  RefreshTokenPayload,
  TempTokenPayload,
} from './jwt';

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
        traceparent?: string
        startTime: number

        // For api key
        apiKey: {
          keyId: string;
          owner: string;
          scopes: string[];
        };

        // For file
        file?: Express.Multer.File;

        // For rate limit
        rateLimitKey?: string
        tempTokenPayload?: TempTokenPayload
      }
  }
}
