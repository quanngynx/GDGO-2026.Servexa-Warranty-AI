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
import { customers, responseCustomers } from "./data/customer";

const route = getRouteApi(
  "/_authenticated/(SYSTEM-ADMINISTRATION)/customer-management/"
);

export function CustomerManagement() {
  const search = route.useSearch();
  const navigate = route.useNavigate();

  console.log("responseCustomers", responseCustomers);
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
        <CustomersTable data={customers} search={search} navigate={navigate} />
      </Main>
      <CustomersDialogs />
    </CustomersProvider>
  );
}
