import { AscCentersManagement } from '@/features/(SYSTEM-ADMINISTRATION)/asc-centers-management'
import { createFileRoute } from '@tanstack/react-router'
import { adminListWithStatusSearchSchema } from '../../../../libs/search-schemas'

export const Route = createFileRoute(
  '/_authenticated/(SYSTEM-ADMINISTRATION)/asc-centers-management/',
)({
  validateSearch: adminListWithStatusSearchSchema,
  component: AscCentersManagement,
})
