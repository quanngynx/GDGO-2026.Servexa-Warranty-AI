import { seedIdentityUser, type SeedIdentityUserOptions } from './identity/user'
import { seedWards } from './location/ward'
import { seedAreas } from './location/area'
import { seedProductCatalog } from './product-catalog'
import { seedHumanResources } from './human-resources'
import { seedASCCenters } from './asc-center/asc-centers'
import { seedRepairCases } from './asc-center/repair-cases'

export * from './identity/user'
export * from './location'
export * from './asc-center/repair-cases'
export * from './asc-center/asc-centers'

export type RunSeedsOptions = {
  identityUser?: Partial<SeedIdentityUserOptions>
}

export const runSeeds = async (options: RunSeedsOptions = {}) => {
  const result = await seedIdentityUser(options.identityUser)
  await seedWards()           // seeds provinces + wards
  await seedAreas()           // seeds areas (depends on provinces + wards)
  await seedProductCatalog()  // seeds categories + models (needed by repair-cases)
  await seedASCCenters()
  await seedHumanResources()  // seeds customer + employee (needed by repair-cases, depends on ascCenter + admin user)
  await seedRepairCases()
  return {
    identityUser: result,
  }
}
