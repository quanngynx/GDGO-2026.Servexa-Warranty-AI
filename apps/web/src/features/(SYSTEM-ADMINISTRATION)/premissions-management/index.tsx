import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { listPayloadFromApi } from '@/libs/api/bases/extract-metadata'
import type { ResponsePermissionListDto } from '@/libs/api/identity/permission/data-transfer-object'
import { PermissionsDialogs } from './components/permissions-dialogs'
import { PermissionsPrimaryButtons } from './components/permissions-primary-buttons'
import { PermissionsProvider } from './components/permissions-provider'
import { PermissionsTable } from './components/permissions-table'
import { usePermissionsQuery } from './hooks/use-permissions-query'
import { useTranslation } from "react-i18next";

const route = getRouteApi('/_authenticated/(SYSTEM-ADMINISTRATION)/permissions-management/')

export function PermissionsManagement() {
    const { t } = useTranslation();
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data, isLoading } = usePermissionsQuery({
    page: search.page,
    limit: search.pageSize,
    search: search.search || undefined,
  })

  const list = listPayloadFromApi<ResponsePermissionListDto>(data)
  const permissions = list?.items ?? []
  const totalPages = list?.pagination?.totalPages ?? 1

  return (
    <PermissionsProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>{t("Permissions Management")}</h2>
            <p className='text-muted-foreground'>{t("Manage system permissions and access rules.")}</p>
          </div>
          <PermissionsPrimaryButtons />
        </div>
        <PermissionsTable
          data={permissions}
          isLoading={isLoading}
          totalPages={totalPages}
          search={search}
          navigate={navigate}
        />
      </Main>

      <PermissionsDialogs />
    </PermissionsProvider>
  )
}
