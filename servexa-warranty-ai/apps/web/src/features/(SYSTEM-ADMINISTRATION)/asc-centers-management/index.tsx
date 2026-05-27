import { ConfigDrawer } from "@/components/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { getRouteApi } from "@tanstack/react-router";
import { UsersDialogs } from "./components/asc-centers-dialogs";
import { UsersPrimaryButtons } from "./components/asc-centers-primary-buttons";
import { UsersProvider } from "./components/asc-centers-provider";
import { UsersTable } from "./components/asc-centers-table";
import { useUsersQuery } from "../user-management/hooks/use-users-query";
import type {
  ResponseUserDto,
  ResponseUserListDto,
} from "@/libs/api/identity/user/data-transfer-object";
import { type User } from "./data/schema";

const route = getRouteApi(
  "/_authenticated/(SYSTEM-ADMINISTRATION)/asc-centers-management/"
);

export function AscCentersManagement() {
  const search = route.useSearch();
  const navigate = route.useNavigate();
  const { data } = useUsersQuery({
    page: (search.page as number) ?? 1,
    limit: (search.pageSize as number) ?? 10,
    search: (search.username as string) || undefined,
  });
  const list = listPayloadFromUsersApi(data);
  const users = (list?.items ?? []).map(mapToSystemAdminUser);

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

function listPayloadFromUsersApi(
  body: unknown
): ResponseUserListDto | undefined {
  if (!body || typeof body !== "object") {
    return undefined;
  }
  const o = body as {
    metadata?: ResponseUserListDto;
    data?: ResponseUserListDto;
  };
  return o.metadata ?? o.data;
}

function mapToSystemAdminUser(user: ResponseUserDto): User {
  return {
    id: user.id,
    fullname: `${user.firstName} ${user.lastName}`.trim(),
    username: user.username,
    companyEmail: user.email,
    personalEmail: user.email,
    phoneNumber: user.phoneNumber,
    avatar: user.avatar ?? "",
    status:
      user.status === "active" ||
      user.status === "inactive" ||
      user.status === "invited" ||
      user.status === "suspended"
        ? user.status
        : "inactive",
    role: user.role as User["role"],
    ascCenter: user.ascCenter
      ? {
          id: user.ascCenter.id,
          centerName: user.ascCenter.centerName,
          centerCode: user.ascCenter.centerCode,
        }
      : null,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
    createdBy: user.createdBy ?? null,
    updatedBy: user.updatedBy ?? null,
  };
}
