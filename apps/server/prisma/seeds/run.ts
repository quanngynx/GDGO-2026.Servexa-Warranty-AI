import path from 'node:path'
import { config } from 'dotenv'

const loadEnv = () => {
  const envPath = path.resolve(process.cwd(), '../../apps/server/.env')
  config({ path: envPath })
}

const parseRoleMode = () => {
  if (process.env.SEED_ROLE_MODE === 'use-existing-role') {
    return 'use-existing-role' as const
  }
  return 'create-role-if-missing' as const
}

const run = async () => {
  loadEnv()
  const { runSeeds } = await import('./index')
  const result = await runSeeds({
    identityUser: {
      roleMode: parseRoleMode(),
    },
  })
  console.log('Seed run completed:', {
    identityUser: result.identityUser.user.username,
    role: result.identityUser.user.role.name,
  })
}

run()
  .then(() => {
    process.exit(0)
  })
  .catch((error: unknown) => {
    console.error('Seed run failed:', error)
    process.exit(1)
  })
