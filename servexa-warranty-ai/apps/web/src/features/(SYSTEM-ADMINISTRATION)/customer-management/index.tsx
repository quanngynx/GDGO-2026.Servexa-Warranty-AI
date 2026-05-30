import { ConfigDrawer } from "@/components/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { getRouteApi } from "@tanstack/react-router";
import { CustomersDialogs } from "./components/customer-dialogs";
import { CustomersPrimaryButtons } from "./components/customer-primary-buttons";
import { CustomersProvider } from "./components/customer-provider";
import { CustomersTable } from "./components/customer-table";
import { listPayloadFromApi } from '@/libs/api/bases/extract-metadata'
import type { ResponseCustomerListDto } from '@/libs/api/human-resources/customer/data-transfer-object'
import { useCustomersQuery } from './hooks/use-customers-query'

const route = getRouteApi(
  "/_authenticated/(SYSTEM-ADMINISTRATION)/customer-management/"
);

export function CustomerManagement() {
  const search = route.useSearch();
  const navigate = route.useNavigate();

  const { data, isLoading } = useCustomersQuery({
    page: search.page,
    limit: search.pageSize,
    search: search.search || undefined,
  })

  const list = listPayloadFromApi<ResponseCustomerListDto>(data)
  const customers = list?.items ?? []
  const totalPages = list?.pagination?.totalPages ?? 1

  return (
    <CustomersProvider>
      <Header fixed>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Customer Management
            </h2>
            <p className="text-muted-foreground">Manage your customers here.</p>
          </div>
          <CustomersPrimaryButtons />
        </div>
        <CustomersTable
          data={customers}
          isLoading={isLoading}
          totalPages={totalPages}
          search={search}
          navigate={navigate}
        />
      </Main>
      <CustomersDialogs />
    </CustomersProvider>
  );
}
