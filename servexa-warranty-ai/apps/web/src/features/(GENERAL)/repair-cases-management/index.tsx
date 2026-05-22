import { Button } from '@servexa-warranty-ai/ui/components/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useAscCentersQuery } from '@/features/(SYSTEM-ADMINISTRATION)/asc-centers-management/hooks/use-asc-centers-query'
import { listPayloadFromApi } from '@/libs/api/bases/extract-metadata'
import type { RepairCaseStatus } from '@/libs/api/asc-center/repair-case/data-transfer-object'
import type { ResponseAscCenterListDto } from '@/libs/api/asc-center/asc-center/data-transfer-object'
import { MessagesSquare, Package } from 'lucide-react'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { RepairCasesPrimaryButtons } from './components/repair-cases-primary-buttons'
import { RepairCasesTable } from './components/repair-cases-table'
import { useRepairCasesQuery } from './hooks/use-repair-cases-query'
import { RepairCasesProvider } from './components/repair-cases-provider'

const route = getRouteApi('/_authenticated/(GENERAL)/repair-cases-management/')

export function RepairCasesManagement() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const appNavigate = useNavigate()

  const { data: ascCentersData } = useAscCentersQuery({ page: 1, limit: 100 })
  const ascCenterList = listPayloadFromApi<ResponseAscCenterListDto>(ascCentersData)
  const ascCenterFilterOptions = useMemo(
    () =>
      (ascCenterList?.items ?? []).map((center) => ({
        label: center.centerName,
        value: center.id,
      })),
    [ascCenterList?.items],
  )

  const { data, isLoading } = useRepairCasesQuery({
    page: search.page,
    limit: search.pageSize,
    search: search.search || undefined,
    status: search.status?.[0] as RepairCaseStatus | undefined,
    ascCenterId: search.ascCenterId?.[0],
  })

  const repairCases = data?.metadata.items ?? []
  const totalPages = data?.metadata.pagination.totalPages ?? 1

  return (
    <RepairCasesProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <Button
            size='icon'
            variant='outline'
            className='md:size-7'
            onClick={() => appNavigate({ to: '/chats' })}
          >
            <MessagesSquare className='size-[1.2rem]' />
          </Button>
          <Button
            size='icon'
            variant='outline'
            className='md:size-7'
            onClick={() => appNavigate({ to: '/apps' })}
          >
            <Package className='size-[1.2rem]' />
          </Button>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Repair Cases</h2>
            <p className='text-muted-foreground'>
              Search and filter repair cases by status and ASC center.
            </p>
          </div>
          <RepairCasesPrimaryButtons />
        </div>
        <RepairCasesTable
          data={repairCases}
          isLoading={isLoading}
          totalPages={totalPages}
          search={search}
          navigate={navigate}
          ascCenterFilterOptions={ascCenterFilterOptions}
        />
      </Main>
    </RepairCasesProvider>
  )
}
