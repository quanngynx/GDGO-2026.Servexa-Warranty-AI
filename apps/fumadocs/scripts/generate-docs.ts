import * as fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as OpenAPI from 'fumadocs-openapi'
import { openapi } from '../src/lib/openapi'

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = path.resolve(appRoot, 'content/docs/api-reference/(generated)')

async function clearGeneratedDocs() {
  const entries = await fs.readdir(outputDir, { withFileTypes: true })

  await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(outputDir, entry.name)
      if (entry.isDirectory()) {
        await fs.rm(fullPath, { recursive: true, force: true })
        return
      }

      if (entry.name !== 'meta.json') {
        await fs.rm(fullPath, { force: true })
      }
    }),
  )
}

async function main() {
  await clearGeneratedDocs()

  await OpenAPI.generateFiles({
    input: openapi,
    output: outputDir,
    per: 'operation',
    includeDescription: true,
    groupBy: 'tag',
  })

  console.log(`Generated OpenAPI docs into ${outputDir}`)
}

void main()
