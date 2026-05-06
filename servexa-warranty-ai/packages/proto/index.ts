import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.dirname(fileURLToPath(import.meta.url))

/** Absolute path to canonical ai_service.proto (workspace root: packages/proto) */
export const aiServiceProtoPath = path.join(dir, 'ai', 'v1', 'ai_service.proto')
