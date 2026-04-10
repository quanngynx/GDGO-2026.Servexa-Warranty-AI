import path from 'node:path'
import { config } from 'dotenv'

type SeedRoleMode = 'use-existing-role' | 'create-role-if-missing'

const parseRoleMode = (): SeedRoleMode => {
  const fromEnv = process.env.SEED_ROLE_MODE
  if (fromEnv === 'create-role-if-missing') {
    return fromEnv
  }
  return 'use-existing-role'
}

const loadEnv = () => {
  const envPath = path.resolve(process.cwd(), '../../apps/server/.env')
  config({ path: envPath })
}

const run = async () => {
  loadEnv()
  const { seedIdentityUser } = await import('./identity/user')
  const result = await seedIdentityUser({
    username: process.env.SEED_ADMIN_USERNAME,
    password: process.env.SEED_ADMIN_PASSWORD,
    fullName: process.env.SEED_ADMIN_FULL_NAME,
    email: process.env.SEED_ADMIN_EMAIL,
    roleName: process.env.SEED_ADMIN_ROLE_NAME,
    roleDescription: process.env.SEED_ADMIN_ROLE_DESCRIPTION,
    roleMode: parseRoleMode(),
  })

  console.log('Seed identity user completed:', {
    username: result.user.username,
    role: result.user.role.name,
    roleMode: result.roleMode,
  })
}

run()
  .then(() => {
    process.exit(0)
  })
  .catch((error: unknown) => {
    console.error('Seed identity user failed:', error)
    process.exit(1)
  })
