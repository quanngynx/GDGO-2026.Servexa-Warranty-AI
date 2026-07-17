import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { listPayloadFromApi } from '@/libs/api/bases/extract-metadata'
import type { ResponseAscCenterListDto } from '@/libs/api/asc-center/asc-center/data-transfer-object'
import { AscCentersDialogs } from './components/asc-centers-dialogs'
import { AscCentersPrimaryButtons } from './components/asc-centers-primary-buttons'
import { AscCentersProvider } from './components/asc-centers-provider'
import { AscCentersTable } from './components/asc-centers-table'
import { useAscCentersQuery } from './hooks/use-asc-centers-query'
import { useTranslation } from "react-i18next";

const route = getRouteApi('/_authenticated/(SYSTEM-ADMINISTRATION)/asc-centers-management/')

export function AscCentersManagement() {
    const { t } = useTranslation();
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data, isLoading } = useAscCentersQuery({
    page: search.page,
    limit: search.pageSize,
    search: search.search || undefined,
    status: search.status?.[0] as 'active' | 'inactive' | 'suspended' | undefined,
  })

  const list = listPayloadFromApi<ResponseAscCenterListDto>(data)
  const centers = list?.items ?? []
  const totalPages = list?.pagination?.totalPages ?? 1

  return (
    <AscCentersProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>{t("ASC Centers Management")}</h2>
            <p className='text-muted-foreground'>
              {t("Manage authorized service centers and their status.")}</p>
          </div>
          <AscCentersPrimaryButtons />
        </div>
        <AscCentersTable
          data={centers}
          isLoading={isLoading}
          totalPages={totalPages}
          search={search}
          navigate={navigate}
        />
      </Main>

      <AscCentersDialogs />
    </AscCentersProvider>
  )
}
