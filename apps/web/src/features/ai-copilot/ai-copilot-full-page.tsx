import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { ConfigDrawer } from "@/components/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { NavigationChats } from "@/components/navigation-chats";
import { NavigationIntergratedApps } from "@/components/navigation-intergrated-apps";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { Button } from "@servexa-warranty-ai/ui/components/button";

import { ServexaCopilotChat } from "./components/servexa-copilot-chat";
import { ServexaCopilotSidebar } from "./components/servexa-copilot-side-panels";
import { SERVEXA_COPILOT_AGENT_ID } from "./constants";
import { useServexaCopilotPanel } from "./hooks/use-servexa-copilot-panel";
import { useTranslation } from "react-i18next";

export function AICopilotFullPage() {
    const { t } = useTranslation();
  const panel = useServexaCopilotPanel(SERVEXA_COPILOT_AGENT_ID);
  const { handleRetryLast, setChatErrorMessage, railMeta } = panel;

  return (
    <div className="flex h-svh min-h-0 flex-col pb-[env(safe-area-inset-bottom)]">
      <Header fixed className="border-b border-border/60">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="shrink-0 gap-1.5">
            <Link to="/">
              <ArrowLeft className="size-4" aria-hidden />
              {t("Back to App")}</Link>
          </Button>
          <div className="min-w-0 border-s border-border ps-3">
            <h1 className="truncate text-balance text-sm font-semibold tracking-tight sm:text-base">
              {t("Operations Intelligence")}</h1>
            <p className="truncate text-xs text-muted-foreground">
              {t("Full-screen copilot · evidence &amp; approvals in the context panel")}</p>
          </div>
        </div>
        <div className="ms-auto flex shrink-0 items-center space-x-4">
          <Search />
          <NavigationChats />
          <NavigationIntergratedApps />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed fluid className="min-h-0 flex-1 p-0">
        <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_min(400px,32vw)]">
          <section
            id="copilot-chat-main"
            aria-label="Copilot chat"
            className="relative flex min-h-0 min-w-0 flex-col bg-muted/15 dark:bg-muted/10"
          >
            <ServexaCopilotChat
              agentId={SERVEXA_COPILOT_AGENT_ID}
              layout="fullPage"
              className="h-full min-h-0"
              sources={railMeta?.sources}
              onChatError={setChatErrorMessage}
              onRetryLast={handleRetryLast}
            />
          </section>
          <aside
            aria-label="Context and approvals"
            className="flex max-h-[42vh] min-h-0 flex-col overscroll-y-contain border-t border-border bg-background/95 backdrop-blur-sm lg:max-h-none lg:border-t-0 lg:border-l"
          >
            <ServexaCopilotSidebar panel={panel} variant="fullPage" />
          </aside>
        </div>
      </Main>
    </div>
  );
}
