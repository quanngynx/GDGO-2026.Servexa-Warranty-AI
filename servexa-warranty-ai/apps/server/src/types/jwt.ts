/**
 * @description Registered Claim Names
 * @link https://datatracker.ietf.org/doc/html/rfc7519#section-4.1
 */
import type { JwtPayload } from 'jsonwebtoken';
import type { RolesScopeType, RolesType } from './role';
import type { KeyTokenModel } from '@servexa-warranty-ai/db/prisma/models';

export interface RefreshTokenPayload extends Pick<
  JwtPayload,
  'aud' | 'exp' | 'iat'
> {
  id: string;
  email: string;
  keyStoreId: string;
  sessionId?: string; // optional to tracking multiple devices
}

export interface AccessTokenPayload extends Pick<
  JwtPayload,
  'aud' | 'exp' | 'iat'
> {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: RolesType;
  roleScope: RolesScopeType;
  permissions: string[];
}

export type KeyStoreForJWT = Pick<
  KeyTokenModel,
  'id' | 'privateKey' | 'publicKey' | 'refreshToken' | 'refreshTokenUsed'
>;

export interface PairToken {
  accessToken: string;
  refreshToken: string;
  iat_accessToken: number;
  exp_accessToken: number;
  iat_refreshToken: number;
  exp_refreshToken: number;
}

export interface TempTokenPayload {
  uid: string;
  email: string;
  type: 'reset-password';
}
