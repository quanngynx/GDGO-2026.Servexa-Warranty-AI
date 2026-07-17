import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { listPayloadFromApi } from '@/libs/api/bases/extract-metadata'
import type { ResponseTotalWarehouseListDto } from '@/libs/api/product-catalog/total-warehouse/data-transfer-object'
import { CentralWarehouseDialogs } from './components/central-warehouse-dialogs'
import { CentralWarehousePrimaryButtons } from './components/central-warehouse-primary-buttons'
import { CentralWarehouseProvider } from './components/central-warehouse-provider'
import { CentralWarehouseTable } from './components/central-warehouse-table'
import { useTotalWarehousesQuery } from './hooks/use-total-warehouses-query'
import { useTranslation } from "react-i18next";

const route = getRouteApi(
  '/_authenticated/(SYSTEM-ADMINISTRATION)/central-warehouse-management/',
)

export function CentralWarehouseManagement() {
    const { t } = useTranslation();
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data, isLoading } = useTotalWarehousesQuery({
    page: search.page,
    limit: search.pageSize,
    search: search.search || undefined,
    status: search.status?.[0] as 'active' | 'inactive' | undefined,
  })

  const list = listPayloadFromApi<ResponseTotalWarehouseListDto>(data)
  const warehouses = list?.items ?? []
  const totalPages = list?.pagination?.totalPages ?? 1

  return (
    <CentralWarehouseProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>{t("Central Warehouse Management")}</h2>
            <p className='text-muted-foreground'>
              {t("Manage total warehouses and central inventory locations.")}</p>
          </div>
          <CentralWarehousePrimaryButtons />
        </div>
        <CentralWarehouseTable
          data={warehouses}
          isLoading={isLoading}
          totalPages={totalPages}
          search={search}
          navigate={navigate}
        />
      </Main>

      <CentralWarehouseDialogs />
    </CentralWarehouseProvider>
  )
}
