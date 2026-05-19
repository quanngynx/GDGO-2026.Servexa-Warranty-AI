import path from 'node:path'
import { config } from 'dotenv'

const loadEnv = () => {
  const envPath = path.resolve(process.cwd(), '../../apps/server/.env')
  config({ path: envPath })
}

const run = async () => {
  loadEnv()
  const { seedHitlPermissions } = await import('./identity/hitl-permissions')
  const result = await seedHitlPermissions()
  console.log('HITL permissions seeded:', result)
}

run()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error('HITL permission seed failed:', error)
    process.exit(1)
  })
