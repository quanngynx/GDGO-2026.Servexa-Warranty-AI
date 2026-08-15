import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { listPayloadFromApi } from '@/libs/api/bases/extract-metadata'
import type { ResponsePurchaseLocationListDto } from '@/libs/api/purchase-channels/purchase-location/data-transfer-object'
import { PurchaseLocationsDialogs } from './components/purchase-locations-dialogs'
import { PurchaseLocationsPrimaryButtons } from './components/purchase-locations-primary-buttons'
import { PurchaseLocationsProvider } from './components/purchase-locations-provider'
import { PurchaseLocationsTable } from './components/purchase-locations-table'
import { usePurchaseLocationsQuery } from './hooks/use-purchase-locations-query'
import { useTranslation } from "react-i18next";

const route = getRouteApi(
  '/_authenticated/(SYSTEM-ADMINISTRATION)/purchase-locations-management/',
)

export function PurchaseLocationsManagement() {
  const { t } = useTranslation();
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const isActiveFilter =
    search.isActive?.[0] === 'true'
      ? true
      : search.isActive?.[0] === 'false'
        ? false
        : undefined

  const { data, isLoading } = usePurchaseLocationsQuery({
    page: search.page,
    limit: search.pageSize,
    search: search.search || undefined,
    isActive: isActiveFilter,
  })

  const list = listPayloadFromApi<ResponsePurchaseLocationListDto>(data)
  const locations = list?.items ?? []
  const totalPages = list?.pagination?.totalPages ?? 1

  return (
    <PurchaseLocationsProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>{t("Purchase Locations Management")}</h2>
            <p className='text-muted-foreground'>
              {t("Manage purchase channel locations and store codes.")}</p>
          </div>
          <PurchaseLocationsPrimaryButtons />
        </div>
        <PurchaseLocationsTable
          data={locations}
          isLoading={isLoading}
          totalPages={totalPages}
          search={search}
          navigate={navigate}
        />
      </Main>

      <PurchaseLocationsDialogs />
    </PurchaseLocationsProvider>
  )
}
