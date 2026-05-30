import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import type {
  RequestListUsersDto,
  ResponseUserListDto,
} from '@/libs/api/identity/user/data-transfer-object'
import { useUsersQuery } from './hooks/use-users-query'

const route = getRouteApi('/_authenticated/(SYSTEM-ADMINISTRATION)/user-management/')

function listPayloadFromUsersApi(
  body: unknown,
): ResponseUserListDto | undefined {
  if (!body || typeof body !== 'object') {
    return undefined
  }
  const o = body as { metadata?: ResponseUserListDto; data?: ResponseUserListDto }
  return o.metadata ?? o.data
}

export function UserManagement() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data, isLoading } = useUsersQuery({
    page: search.page,
    limit: search.pageSize,
    search: search.username || search.search || undefined,
    status: search.status?.[0] as RequestListUsersDto['status'],
  })

  const list = listPayloadFromUsersApi(data)

  const users = list?.items ?? []
  const totalPages = list?.pagination?.totalPages ?? 1

  return (
    <UsersProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>User Management</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <UsersTable
          data={users}
          isLoading={isLoading}
          totalPages={totalPages}
          search={search}
          navigate={navigate}
        />
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
