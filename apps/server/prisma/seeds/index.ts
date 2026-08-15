import { seedIdentityUser, type SeedIdentityUserOptions } from './identity/user'
import { seedHitlPermissions } from './identity/hitl-permissions'
import { seedApiPermissions } from './identity/api-permissions'
import { seedWards } from './location/ward'
import { seedAreas } from './location/area'
import { seedProductCatalog } from './product-catalog'
import { seedHumanResources } from './human-resources'
import { seedASCCenters } from './asc-center/asc-centers'
import { seedRepairCases } from './asc-center/repair-cases'
import { seedPurchaseChannels } from './purchase-channel'

import { seedProductWarranties } from './asc-center/product-warranties'
import { seedAccessoryStock } from './asc-center/accessory-stock'
import { seedAccessoryOperations } from './asc-center/accessory-operations'
import { seedRepairCaseDetails } from './asc-center/repair-case-details'
import { seedFinancials } from './asc-center/financials'
import { seedRecalls } from './asc-center/recalls'

export * from './identity/user'
export * from './identity/hitl-permissions'
export * from './identity/api-permissions'
export * from './location'
export * from './asc-center/repair-cases'
export * from './asc-center/asc-centers'

export type RunSeedsOptions = {
  identityUser?: Partial<SeedIdentityUserOptions>
}

export const runSeeds = async (options: RunSeedsOptions = {}) => {
  const result = await seedIdentityUser(options.identityUser)
  await seedHitlPermissions()
  await seedApiPermissions()
  await seedWards()           // seeds provinces + wards
  await seedAreas()           // seeds areas (depends on provinces + wards)
  await seedProductCatalog()  // seeds categories + models (needed by repair-cases)
  await seedASCCenters()
  await seedHumanResources()  // seeds customer + employee (needed by repair-cases, depends on ascCenter + admin user)
  await seedPurchaseChannels()
  await seedRepairCases()
  await seedProductWarranties()
  await seedAccessoryStock()
  await seedAccessoryOperations()
  await seedRepairCaseDetails()
  await seedFinancials()
  await seedRecalls()
  return {
    identityUser: result,
  }
}
