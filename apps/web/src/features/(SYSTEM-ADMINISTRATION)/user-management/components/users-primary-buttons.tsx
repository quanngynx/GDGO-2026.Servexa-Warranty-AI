import { MailPlus, UserPlus } from "lucide-react";
import { Button } from "@servexa-warranty-ai/ui/components/button";
import { useUsers } from "./users-provider";
import { useTranslation } from "react-i18next";

export function UsersPrimaryButtons() {
    const { t } = useTranslation();
  const { setOpen } = useUsers();
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="space-x-1"
        onClick={() => setOpen("invite")}
      >
        <span>{t("Invite User")}</span> <MailPlus size={18} />
      </Button>
      <Button className="space-x-1" onClick={() => setOpen("add")}>
        <span>{t("Add User")}</span> <UserPlus size={18} />
      </Button>
    </div>
  );
}
