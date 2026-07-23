import { Button } from "@servexa-warranty-ai/ui/components/button";
import { UserPlus } from "lucide-react";
import { useCustomers } from "./customer-provider";
import { useTranslation } from "react-i18next";

export function CustomersPrimaryButtons() {
    const { t } = useTranslation();
  const { setOpen } = useCustomers();
  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen("add")}>
        <span>{t("Add Customer")}</span> <UserPlus size={18} />
      </Button>
    </div>
  );
}
