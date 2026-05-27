import { useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@servexa-warranty-ai/ui/components/select'
import { Label } from '@servexa-warranty-ai/ui/components/label'
import { AccessoriesDialogs } from './components/accessories-dialogs'
import { AccessoriesPrimaryButtons } from './components/accessories-primary-buttons'
import { AccessoriesProvider } from './components/accessories-provider'
import { AccessoriesTable } from './components/accessories-table'
import { useAccessoriesQuery } from './hooks/use-accessories-query'
import { useTotalWarehousesQuery } from './hooks/use-total-warehouses-query'

const route = getRouteApi('/_authenticated/(SYSTEM-ADMINISTRATION)/accessories-management/')

export function AccessoriesManagement() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data: warehousesData, isLoading: warehousesLoading } = useTotalWarehousesQuery()
  const warehouseList =
    listPayloadFromApi<ResponseTotalWarehouseListDto>(warehousesData)?.items ?? []

  const warehouseId = search.totalWarehouseId || warehouseList[0]?.id
  const useGlobalList = warehouseList.length === 0 && !warehousesLoading

  useEffect(() => {
    if (!search.totalWarehouseId && warehouseList[0]?.id) {
      navigate({
        search: {
          ...search,
          totalWarehouseId: warehouseList[0]!.id,
        },
        replace: true,
      })
    }
  }, [search, search.totalWarehouseId, warehouseList, navigate])

  const handleWarehouseChange = (nextWarehouseId: string) => {
    navigate({
      search: {
        ...search,
        totalWarehouseId: nextWarehouseId,
        page: 1,
      },
    })
  }

  const { data, isLoading } = useAccessoriesQuery({
    page: search.page,
    limit: search.pageSize,
    search: search.search || undefined,
    status: search.status?.[0] as 'active' | 'inactive' | undefined,
    totalWarehouseId: warehouseId,
    useGlobalList,
  })

  const list = listPayloadFromApi<ResponseAccessoryListDto>(data)
  const accessories = list?.items ?? []
  const totalPages = list?.pagination?.totalPages ?? 1

  return (
    <AccessoriesProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Accessories Management</h2>
            <p className='text-muted-foreground'>
              Manage accessories by total warehouse or browse the global catalog.
            </p>
          </div>
          <AccessoriesPrimaryButtons />
        </div>

        {warehouseList.length > 0 && (
          <div className='flex max-w-sm flex-col gap-2'>
            <Label htmlFor='warehouse-select'>Total warehouse</Label>
            <Select value={warehouseId} onValueChange={handleWarehouseChange}>
              <SelectTrigger id='warehouse-select' className='w-full'>
                <SelectValue placeholder='Select a warehouse' />
              </SelectTrigger>
              <SelectContent>
                {warehouseList.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <AccessoriesTable
          data={accessories}
          isLoading={isLoading || warehousesLoading}
          totalPages={totalPages}
          search={search}
          navigate={navigate}
        />
      </Main>

      <AccessoriesDialogs />
    </AccessoriesProvider>
  )
}
