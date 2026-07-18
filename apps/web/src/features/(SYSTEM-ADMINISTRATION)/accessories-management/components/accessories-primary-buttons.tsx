import { getRouteApi } from "@tanstack/react-router";
import { ChevronDown, CircleEllipsis, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@servexa-warranty-ai/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@servexa-warranty-ai/ui/components/dropdown-menu";
import { useAccessories } from "./accessories-provider";

const route = getRouteApi(
  "/_authenticated/(SYSTEM-ADMINISTRATION)/accessories-management/",
);

export function AccessoriesPrimaryButtons() {
  const { t } = useTranslation();
  const { setOpen } = useAccessories();
  const search = route.useSearch();

  const isWarehouseSelected = !!search.totalWarehouseIds;
  const isAscSelected = !!search.ascCenterIds;

  let buttonText = t("Add Accessory");
  if (isWarehouseSelected) {
    buttonText = t("Add Accessory to Warehouse");
  } else if (isAscSelected) {
    buttonText = t("Add Accessory to ASC Center");
  }

  return (
    <div className="flex gap-2">
      <Button className="space-x-1.5" onClick={() => setOpen("add")}>
        <Plus size={18} />
        <span>{buttonText}</span>
      </Button>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="space-x-1.5">
            <CircleEllipsis size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px]">
          <DropdownMenuItem onClick={() => setOpen("add")}>
            <span>{t("Add Accessory to Warehouse")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen("add")}>
            <span>{t("Add Accessory to ASC center")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
