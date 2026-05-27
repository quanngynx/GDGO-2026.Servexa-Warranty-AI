export function listPayloadFromApi<T>(body: unknown): T | undefined {
  if (!body || typeof body !== 'object') {
    return undefined
  }
  const o = body as { metadata?: T; data?: T }
  return o.metadata ?? o.data
}
