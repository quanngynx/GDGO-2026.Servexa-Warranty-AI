import path from 'node:path'
import { createOpenAPI } from 'fumadocs-openapi/server'

const openapiInputPath = path.resolve('./content/docs/api-reference/openapi.yml').replaceAll('\\', '/')

export const openapi = createOpenAPI({
  input: [openapiInputPath],
  proxyUrl: '/api/proxy',
})