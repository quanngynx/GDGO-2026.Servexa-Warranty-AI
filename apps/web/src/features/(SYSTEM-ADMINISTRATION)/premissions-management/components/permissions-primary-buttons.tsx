import { Button } from "@servexa-warranty-ai/ui/components/button";
import { MailPlus, UserPlus } from "lucide-react";
import { usePermissions } from './permissions-provider'

export function PermissionsPrimaryButtons() {
  const { setOpen } = usePermissions()
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="space-x-1"
        onClick={() => setOpen("invite")}
      >
        <span>Invite User</span> <MailPlus size={18} />
      </Button>
      <Button className="space-x-1" onClick={() => setOpen("add")}>
        <span>Add User</span> <UserPlus size={18} />
      </Button>
    </div>
  );
}
