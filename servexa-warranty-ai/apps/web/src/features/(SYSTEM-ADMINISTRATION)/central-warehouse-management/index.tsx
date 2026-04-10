import { ConfigDrawer } from "@/components/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { getRouteApi } from "@tanstack/react-router";
import { UsersPrimaryButtons } from "./components/central-warehouse-primary-buttons";
import { UsersDialogs } from "./components/central-warehouse-dialogs";
import { UsersProvider } from "./components/central-warehouse-provider";
import { UsersTable } from "./components/central-warehouse-table";
import { users } from "./data/central-warehouse";

const route = getRouteApi(
  "/_authenticated/(SYSTEM-ADMINISTRATION)/user-management/"
);

export function UserManagement() {
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
