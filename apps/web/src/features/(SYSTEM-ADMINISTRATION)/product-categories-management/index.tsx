import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { listPayloadFromApi } from '@/libs/api/bases/extract-metadata'
import type { ResponseCategoryListDto } from '@/libs/api/product-catalog/category/data-transfer-object'
import { CategoriesDialogs } from './components/product-categories-dialogs'
import { CategoriesPrimaryButtons } from './components/product-categories-primary-buttons'
import { CategoriesProvider } from './components/product-categories-provider'
import { CategoriesTable } from './components/product-categories-table'
import { useCategoriesQuery } from './hooks/use-categories-query'
import { useTranslation } from "react-i18next";

const route = getRouteApi(
  '/_authenticated/(SYSTEM-ADMINISTRATION)/product-categories-management/',
)

export function ProductCategoriesManagement() {
    const { t } = useTranslation();
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data, isLoading } = useCategoriesQuery({
    page: search.page,
    limit: search.pageSize,
    search: search.search || undefined,
    status: search.status?.[0] as 'active' | 'inactive' | undefined,
  })

  const list = listPayloadFromApi<ResponseCategoryListDto>(data)
  const categories = list?.items ?? []
  const totalPages = list?.pagination?.totalPages ?? 1

  return (
    <CategoriesProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>{t("Product Categories")}</h2>
            <p className='text-muted-foreground'>{t("Manage product categories and their status.")}</p>
          </div>
          <CategoriesPrimaryButtons />
        </div>
        <CategoriesTable
          data={categories}
          isLoading={isLoading}
          totalPages={totalPages}
          search={search}
          navigate={navigate}
        />
      </Main>

      <CategoriesDialogs />
    </CategoriesProvider>
  )
}
