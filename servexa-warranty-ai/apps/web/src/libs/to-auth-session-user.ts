import type {
  ResponseAuthUserDto,
  ResponseMeUserDto,
} from "./api/identity/auth/data-transfer-object";

export type AuthSessionUser = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  roleScope?: string;
  permissions: string[];
};

export function toAuthSessionUser(
  user: ResponseAuthUserDto | ResponseMeUserDto,
): AuthSessionUser {
  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    roleScope: "roleScope" in user ? user.roleScope : undefined,
    permissions: user.permissions ?? [],
  };
}
