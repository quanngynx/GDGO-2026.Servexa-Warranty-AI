import { useLayout } from "@servexa-warranty-ai/ui/contexts/layout-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@servexa-warranty-ai/ui/components/sidebar";
import { AppTitle } from "./app-title";
import { sidebarData } from "./data/sidebar-data";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { useProfileQuery } from "@/features/auth/hooks/use-profile-query";

export function AppSidebar() {
  const { collapsible, variant } = useLayout();
  const { data: user } = useProfileQuery();

  const navUser = user ? {
    name: user.fullName || "User",
    email: user.email || "",
    avatar: "", // No avatar provided in AuthSessionUser yet
  } : sidebarData.user;
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <AppTitle />
      </SidebarHeader>
      <SidebarContent>
        
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
