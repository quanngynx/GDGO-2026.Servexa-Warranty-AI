import type { WarrantyEligibility } from "@servexa-warranty-ai/ai-contracts";
import { ShieldCheck } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@servexa-warranty-ai/ui/components/collapsible";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";
import { useTranslation } from "react-i18next";

const statusLabel: Record<WarrantyEligibility["status"], string> = {
  eligible: "Eligible",
  not_eligible: "Not eligible",
  unknown: "Unknown",
};

type WarrantyEligibilityCardProps = {
  eligibility: WarrantyEligibility;
  className?: string;
};

export function WarrantyEligibilityCard({ eligibility, className }: WarrantyEligibilityCardProps) {
    const { t } = useTranslation();
  return (
    <Collapsible defaultOpen className={cn("border-t border-border px-2 py-2", className)}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium hover:bg-muted">
        <ShieldCheck className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        {t("Warranty eligibility")}</CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 px-2 pb-2 text-xs">
        <p>
          <span className="font-medium text-foreground">{t("Status:")}</span>
          <span className="text-muted-foreground">{statusLabel[eligibility.status]}</span>
        </p>
        <p className="text-muted-foreground">{eligibility.reason}</p>
        {eligibility.warrantyForm ? (
          <p>
            <span className="font-medium text-foreground">{t("Form:")}</span>
            <span className="text-muted-foreground">{eligibility.warrantyForm}</span>
          </p>
        ) : null}
        {eligibility.warrantyServiceType ? (
          <p>
            <span className="font-medium text-foreground">{t("Service:")}</span>
            <span className="text-muted-foreground">{eligibility.warrantyServiceType}</span>
          </p>
        ) : null}
        {typeof eligibility.confidence === "number" ? (
          <p className="text-muted-foreground">
            {t("Confidence:")}{Math.round(eligibility.confidence * 100)}%
          </p>
        ) : null}
      </CollapsibleContent>
    </Collapsible>
  );
}
