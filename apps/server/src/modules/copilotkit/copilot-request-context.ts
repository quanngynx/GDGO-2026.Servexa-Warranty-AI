import { AsyncLocalStorage } from "node:async_hooks";

import type { AccessTokenPayload } from "@/types/jwt";

export type CopilotRequestUser = Pick<
  AccessTokenPayload,
  "id" | "email" | "role" | "roleScope" | "permissions"
>;

const storage = new AsyncLocalStorage<CopilotRequestUser>();

export function runWithCopilotUser<T>(
  user: CopilotRequestUser,
  fn: () => T,
): T {
  return storage.run(user, fn);
}

export function getCopilotRequestUser(): CopilotRequestUser | undefined {
  return storage.getStore();
}
