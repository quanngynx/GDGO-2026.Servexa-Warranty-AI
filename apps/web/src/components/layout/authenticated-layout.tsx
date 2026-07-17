import { AppSidebar } from "@/components/layout/app-sidebar";
import { SkipToMain } from "@/components/skip-to-main";
import { AuthenticatedCopilotProviders } from "@/features/ai-copilot/authenticated-copilot-providers";
import { SidebarInset, SidebarProvider } from "@servexa-warranty-ai/ui/components/sidebar";
import { LayoutProvider } from "@servexa-warranty-ai/ui/contexts/layout-provider";
import { SearchProvider } from "@servexa-warranty-ai/ui/contexts/search-provider";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";
import { getCookie } from "@servexa-warranty-ai/ui/lib/cookie";
import { lazy, Suspense } from "react";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { AISearchDialog } from "@/features/ai-search";
import { isCopilotRailHiddenRoute } from "@/features/ai-copilot/constants";
import { useTranslation } from "react-i18next";

const AICopilotRail = lazy(async () => {
  const mod = await import("@/features/ai-copilot/ai-copilot-rail");
  return { default: mod.AICopilotRail };
});

type AuthenticatedLayoutProps = {
  children?: React.ReactNode;
};

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
    const { t } = useTranslation();
  const defaultOpen = getCookie("sidebar_state") !== "false";
  const hideCopilotRail = useRouterState({
    select: (s) => isCopilotRailHiddenRoute(s.location.pathname),
  });

  return (
    <AuthenticatedCopilotProviders>
      <SearchProvider>
        <LayoutProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <SkipToMain />
            <AppSidebar />
            <div className="flex min-w-0 flex-1">
              <SidebarInset
                className={cn(
                  "@container/content",
                  "has-data-[layout=fixed]:h-svh",
                  "peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]",
                )}
              >
                {children ?? <Outlet />}
              </SidebarInset>
              {!hideCopilotRail ? (
                <Suspense
                  fallback={
                    <aside
                      className="flex h-svh w-12 shrink-0 items-start justify-center border-l border-border bg-muted/40 pt-3"
                      aria-hidden
                    >
                      <span className="text-[10px] text-muted-foreground">{t("AI")}</span>
                    </aside>
                  }
                >
                  <AICopilotRail />
                </Suspense>
              ) : null}
              <AISearchDialog />
            </div>
          </SidebarProvider>
        </LayoutProvider>
      </SearchProvider>
    </AuthenticatedCopilotProviders>
  );
}
