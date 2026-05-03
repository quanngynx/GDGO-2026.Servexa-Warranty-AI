import { ConfigDrawer } from "@/components/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { getRouteApi } from "@tanstack/react-router";
import { UsersDialogs } from "./components/purchase-locations-dialogs";
import { UsersPrimaryButtons } from "./components/purchase-locations-primary-buttons";
import { UsersProvider } from "./components/purchase-locations-provider";
import { UsersTable } from "./components/purchase-locations-table";
import { users } from "./data/purchase-locations";

const route = getRouteApi(
  "/_authenticated/(SYSTEM-ADMINISTRATION)/purchase-locations-management/"
);

export function PurchaseLocationsManagement() {
  const search = route.useSearch();
  const navigate = route.useNavigate();

  return (
    <UsersProvider>
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
              User Management
            </h2>
            <p className="text-muted-foreground">
              Manage your users and their roles here. here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <UsersTable data={users} search={search} navigate={navigate} />
      </Main>

      <UsersDialogs />
    </UsersProvider>
  );
}
