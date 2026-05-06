import { AppSidebar } from "@/components/layout/app-sidebar";
import { SkipToMain } from "@/components/skip-to-main";
import { AICopilotPanel } from "@/features/ai-copilot";
import { SidebarInset, SidebarProvider } from "@servexa-warranty-ai/ui/components/sidebar";
import { LayoutProvider } from "@servexa-warranty-ai/ui/contexts/layout-provider";
import { SearchProvider } from "@servexa-warranty-ai/ui/contexts/search-provider";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";
import { getCookie } from "@servexa-warranty-ai/ui/lib/cookie";
import { Outlet } from "@tanstack/react-router";

type AuthenticatedLayoutProps = {
  children?: React.ReactNode;
};

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie("sidebar_state") !== "false";
  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          <AppSidebar />
          <SidebarInset
            className={cn(
              // Set content container, so we can use container queries
              "@container/content",

              // If layout is fixed, set the height
              // to 100svh to prevent overflow
              "has-data-[layout=fixed]:h-svh",

              // If layout is fixed and sidebar is inset,
              // set the height to 100svh - spacing (total margins) to prevent overflow
              "peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]"
            )}
          >
            {children ?? <Outlet />}
          </SidebarInset>
          
          {/* AI Copilot Panel - Fixed right sidebar */}
          <AICopilotPanel />
        </SidebarProvider>
      </LayoutProvider>
    </SearchProvider>
  );
}
