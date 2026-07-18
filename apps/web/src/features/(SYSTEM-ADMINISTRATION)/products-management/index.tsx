import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { listPayloadFromApi } from '@/libs/api/bases/extract-metadata'
import type { ResponseModelListDto } from '@/libs/api/product-catalog/model/data-transfer-object'
import { ProductsDialogs } from './components/products-dialogs'
import { ProductsPrimaryButtons } from './components/products-primary-buttons'
import { ProductsProvider } from './components/products-provider'
import { ProductsTable } from './components/products-table'
import { useModelsQuery } from './hooks/use-models-query'
import { useTranslation } from "react-i18next";

const route = getRouteApi('/_authenticated/(SYSTEM-ADMINISTRATION)/products-management/')

export function ProductsManagement() {
  const { t } = useTranslation();
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data, isLoading } = useModelsQuery({
    page: search.page,
    limit: search.pageSize,
    search: search.search || undefined,
    status: search.status?.[0],
  })

  const list = listPayloadFromApi<ResponseModelListDto>(data)
  const models = list?.items ?? []
  const totalPages = list?.pagination?.totalPages ?? 1

  return (
    <ProductsProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>{t("Products Management")}</h2>
            <p className='text-muted-foreground'>
              {t("Manage product models and catalog entries.")}</p>
          </div>
          <ProductsPrimaryButtons />
        </div>
        <ProductsTable
          data={models}
          isLoading={isLoading}
          totalPages={totalPages}
          search={search}
          navigate={navigate}
        />
      </Main>

      <ProductsDialogs />
    </ProductsProvider>
  )
}
