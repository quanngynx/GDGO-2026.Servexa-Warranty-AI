import { Avatar, AvatarFallback, AvatarImage } from "@servexa-warranty-ai/ui/components/avatar";
import { SidebarMenuButton } from "@servexa-warranty-ai/ui/components/sidebar";

type NavUserProps = {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
};

export function NavUser({ user }: NavUserProps) {
  return (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    >
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="rounded-lg">SN</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-start text-sm leading-tight">
        <span className="truncate font-semibold">{user.name}</span>
        <span className="truncate text-xs">{user.email}</span>
      </div>
    </SidebarMenuButton>
  );
}
