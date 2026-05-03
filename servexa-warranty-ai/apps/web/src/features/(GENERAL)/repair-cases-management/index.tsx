import { Button } from "@servexa-warranty-ai/ui/components/button";
import { ConfigDrawer } from "@/components/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { MessagesSquare, Package } from "lucide-react";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { RepairCasesPrimaryButtons } from "./components/repair-cases-primary-buttons";
import { RepairCasesTable } from "./components/repair-cases-table";
import { useRepairCasesQuery } from "./hooks/use-repair-cases-query";
import { RepairCasesProvider } from "./components/repair-cases-provider";

const route = getRouteApi("/_authenticated/(GENERAL)/repair-cases-management/");

export function RepairCasesManagement() {
  const search = route.useSearch();
  const navigate = route.useNavigate();

  const { data, isLoading } = useRepairCasesQuery({
    page: search.page,
    limit: search.pageSize,
    search: search.username || undefined,
  });

  const repairCases = data?.metadata.items ?? [];
  const totalPages = data?.metadata.pagination.totalPages ?? 1;

  return (
    <RepairCasesProvider>
      {/* ===== Top Heading ===== */}
      <Header fixed>
        <div className="ms-auto flex items-center space-x-4">
          <Search />
          <Button
            size="icon"
            variant="outline"
            className="md:size-7"
            onClick={() => navigate({ to: "/chats" })}
          >
            <MessagesSquare className="size-[1.2rem]" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="md:size-7"
            onClick={() => navigate({ to: "/apps" })}
          >
            <Package className="size-[1.2rem]" />
          </Button>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              User Management
            </h2>
            <p className="text-muted-foreground">
              Manage your users and their roles here.
            </p>
          </div>
          <RepairCasesPrimaryButtons />
        </div>
        <RepairCasesTable
          data={repairCases}
          isLoading={isLoading}
          totalPages={totalPages}
          search={search}
          navigate={navigate}
        />
      </Main>
    </RepairCasesProvider>
  );
}
