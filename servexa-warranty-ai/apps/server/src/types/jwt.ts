/**
 * @description Registered Claim Names
 * @link https://datatracker.ietf.org/doc/html/rfc7519#section-4.1
 *
 * Do not set `exp` / `iat` on payloads passed to `jwt.sign` when using
 * `expiresIn` — jsonwebtoken rejects that combination.
 */
import type { RolesScopeType, RolesType } from './role';

export interface RefreshTokenPayload {
  id: string;
  email: string;
  keyStoreId: string;
  sessionId?: string; // optional to tracking multiple devices
  aud?: string;
  /** Present after decode / verify */
  iat?: number;
  exp?: number;
}

export interface AccessTokenPayload {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: RolesType;
  roleScope: RolesScopeType;
  permissions: string[];
  aud?: string;
  /** Present after decode / verify */
  iat?: number;
  exp?: number;
}

export type KeyStoreForJWT = {
  id: string;
  privateKey: string;
  publicKey: string;
  refreshToken: string;
  refreshTokenUsed: string[];
};

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
