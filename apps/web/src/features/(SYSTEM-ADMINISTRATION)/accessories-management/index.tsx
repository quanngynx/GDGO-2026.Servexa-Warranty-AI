import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { listPayloadFromApi } from '@/libs/api/bases/extract-metadata'
import type { ResponseAccessoryListDto } from '@/libs/api/product-catalog/accessory/data-transfer-object'
import type { ResponseTotalWarehouseListDto } from '@/libs/api/product-catalog/total-warehouse/data-transfer-object'
import { AccessoriesDialogs } from './components/accessories-dialogs'
import { AccessoriesPrimaryButtons } from './components/accessories-primary-buttons'
import { AccessoriesProvider } from './components/accessories-provider'
import { AccessoriesTable } from './components/accessories-table'
import { useAccessoriesQuery } from './hooks/use-accessories-query'
import { useTotalWarehousesQuery } from './hooks/use-total-warehouses-query'
import { useAscCentersQuery } from '../asc-centers-management/hooks/use-asc-centers-query'
import type { ResponseAscCenterListDto } from '@/libs/api/asc-center/asc-center/data-transfer-object'
import { useTranslation } from "react-i18next";

const route = getRouteApi('/_authenticated/(SYSTEM-ADMINISTRATION)/accessories-management/')

export function AccessoriesManagement() {
  const { t } = useTranslation();
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data: warehousesData, isLoading: warehousesLoading } = useTotalWarehousesQuery()
  const warehouseList =
    listPayloadFromApi<ResponseTotalWarehouseListDto>(warehousesData)?.items ?? []

  const { data: ascCentersData, isLoading: ascCentersLoading } = useAscCentersQuery()
  const ascCenterList =
    listPayloadFromApi<ResponseAscCenterListDto>(ascCentersData)?.items ?? []

  const selectedWarehouseIds = new Set<string>(
    search.totalWarehouseIds ? search.totalWarehouseIds.split(',') : [],
  )
  const selectedAscCenterIds = new Set<string>(
    search.ascCenterIds ? search.ascCenterIds.split(',') : [],
  )

  const handleWarehouseChange = (newSelected: Set<string>) => {
    navigate({
      search: {
        ...search,
        totalWarehouseIds: newSelected.size > 0 ? Array.from(newSelected).join(',') : undefined,
        page: 1,
      },
    })
  }

  const handleAscCenterChange = (newSelected: Set<string>) => {
    navigate({
      search: {
        ...search,
        ascCenterIds: newSelected.size > 0 ? Array.from(newSelected).join(',') : undefined,
        page: 1,
      },
    })
  }

  const handleResetFilters = () => {
    navigate({
      search: (prev: Record<string, unknown>) => ({
        ...prev,
        search: undefined,
        status: undefined,
        totalWarehouseIds: undefined,
        ascCenterIds: undefined,
        page: 1,
      }),
    })
  }

  const { data, isLoading } = useAccessoriesQuery({
    page: search.page,
    limit: search.pageSize,
    search: search.search || undefined,
    status: search.status?.[0] as 'active' | 'inactive' | undefined,
    totalWarehouseIds: search.totalWarehouseIds || undefined,
    ascCenterIds: search.ascCenterIds || undefined,
  })

  const list = listPayloadFromApi<ResponseAccessoryListDto>(data)
  const accessories = list?.items ?? []
  const totalPages = list?.pagination?.totalPages ?? 1

  return (
    <AccessoriesProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>{t("Accessories Management")}</h2>
            <p className='text-muted-foreground'>
              {t("Manage accessories by total warehouse or browse the global catalog.")}</p>
          </div>
          <AccessoriesPrimaryButtons />
        </div>

        <AccessoriesTable
          data={accessories}
          isLoading={isLoading || warehousesLoading || ascCentersLoading}
          totalPages={totalPages}
          search={search}
          navigate={navigate}
          warehouseList={warehouseList}
          ascCenterList={ascCenterList}
          selectedWarehouseIds={selectedWarehouseIds}
          selectedAscCenterIds={selectedAscCenterIds}
          onWarehouseChange={handleWarehouseChange}
          onAscCenterChange={handleAscCenterChange}
          onResetFilters={handleResetFilters}
        />
      </Main>

      <AccessoriesDialogs />
    </AccessoriesProvider>
  )
}
