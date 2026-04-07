import { Logo } from "@/assets/logo";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@servexa-warranty-ai/ui/components/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@servexa-warranty-ai/ui/components/tooltip";
import { Link } from "@tanstack/react-router";

export function AppTitle() {
  const { setOpenMobile } = useSidebar();
  const activeTeam = {
    name: "Servexa",
    logo: Logo,
    plan: "Servexa ASC Customer Service Management System",
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="gap-0 py-0 hover:bg-transparent active:bg-transparent"
          asChild
        >
          <div>
            <Link
              to="/"
              onClick={() => setOpenMobile(false)}
              className="flex items-center gap-2 text-start text-sm leading-tight"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-primary-foreground">
                <activeTeam.logo className="size-4" />
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="grid flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {activeTeam.name}
                    </span>
                    <span className="truncate text-xs">{activeTeam.plan}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{activeTeam.plan}</p>
                </TooltipContent>
              </Tooltip>
            </Link>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
