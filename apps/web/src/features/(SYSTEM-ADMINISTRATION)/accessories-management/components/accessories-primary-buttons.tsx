import { Button } from "@servexa-warranty-ai/ui/components/button";
import { MailPlus, UserPlus } from "lucide-react";
import { useAccessories } from './accessories-provider'
import { useTranslation } from "react-i18next";

export function AccessoriesPrimaryButtons() {
    const { t } = useTranslation();
  const { setOpen } = useAccessories()
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
