import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { listPayloadFromApi } from '@/libs/api/bases/extract-metadata'
import type { ResponseRoleDto } from '@/libs/api/identity/role/data-transfer-object'
import { RolesDialogs } from './components/roles-dialogs'
import { RolesPrimaryButtons } from './components/roles-primary-buttons'
import { RolesProvider } from './components/roles-provider'
import { RolesTable } from './components/roles-table'
import { useRolesQuery } from './hooks/use-roles-query'

const route = getRouteApi('/_authenticated/(SYSTEM-ADMINISTRATION)/roles-management/')

export function RolesManagement() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data, isLoading } = useRolesQuery({
    page: search.page,
    limit: search.pageSize,
    search: search.search || undefined,
  })

  const roles = listPayloadFromApi<ResponseRoleDto[]>(data) ?? []
  const pageSize = search.pageSize ?? 10
  const totalPages =
    roles.length < pageSize ? Math.max(1, search.page ?? 1) : (search.page ?? 1) + 1

  return (
    <RolesProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Roles Management</h2>
            <p className='text-muted-foreground'>Manage application roles and access levels.</p>
          </div>
          <RolesPrimaryButtons />
        </div>
        <RolesTable
          data={roles}
          isLoading={isLoading}
          totalPages={totalPages}
          search={search}
          navigate={navigate}
        />
      </Main>

      <RolesDialogs />
    </RolesProvider>
  )
}
