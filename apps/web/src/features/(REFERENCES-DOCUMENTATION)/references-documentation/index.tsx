import { ConfigDrawer } from "@/components/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { useTranslation } from "react-i18next";

export function ReferenceDocumentation() {
    const { t } = useTranslation();
  return (
    <>
      <Header fixed>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t("Reference Documentation")}</h2>
          <p className="text-muted-foreground">
            {t("Browse reference materials and system documentation.")}</p>
        </div>
      </Main>
    </>
  );
}
