import { seedIdentityUser, type SeedIdentityUserOptions } from './identity/user'

export * from './identity/user'
export * from './location'

export type RunSeedsOptions = {
  identityUser?: Partial<SeedIdentityUserOptions>
}

export const runSeeds = async (options: RunSeedsOptions = {}) => {
  const result = await seedIdentityUser(options.identityUser)
  return {
    identityUser: result,
  }
}
