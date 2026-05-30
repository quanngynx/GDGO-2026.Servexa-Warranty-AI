import util from 'node:util';

import { type Request } from 'express';

export function safeSerialize(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  try {
    return util.inspect(value, { depth: null, compact: false });
  } catch {
    return '[unserializable]';
  }
}

export function getRequestInfo(req: Request, context: string): {
  method: string;
  url: string;
  ip: string;
  userAgent: string;
  context: string;
} {
  return {
    method: req.method,
    url: req.url,
    ip: req.ip || req.socket.remoteAddress || "",
    userAgent: req.get("User-Agent") || "unknown",
    context: context || "",
  };
}
