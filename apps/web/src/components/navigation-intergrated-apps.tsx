import { Package } from "lucide-react";
import { Button } from "@servexa-warranty-ai/ui/components/button";
import { useNavigate } from "@tanstack/react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "@servexa-warranty-ai/ui/components/tooltip";
import { useTranslation } from "react-i18next";

export function NavigationIntergratedApps() {
    const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="md:size-7"
          onClick={() => navigate({ to: "/apps" })}
        >
          <Package className="size-[1.2rem]" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{t("Intergrated Apps")}</TooltipContent>
    </Tooltip>
  );
}
