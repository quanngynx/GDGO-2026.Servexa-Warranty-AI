import { Button } from "@servexa-warranty-ai/ui/components/button";
import { ConfigDrawer } from "@/components/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { MessagesSquare, Package } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function PaymentPendingRepairCases() {
    const { t } = useTranslation();
  const navigate = useNavigate()
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
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
      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            {t("Payment Pending Repair Cases")}</h1>
          <div className="flex items-center space-x-2">
            <Button>{t("Download")}</Button>
          </div>
        </div>
      </Main>
    </>
  );
}
