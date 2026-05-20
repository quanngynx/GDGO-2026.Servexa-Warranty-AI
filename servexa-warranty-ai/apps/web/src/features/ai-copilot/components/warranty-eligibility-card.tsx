import type { WarrantyEligibility } from "@servexa-warranty-ai/ai-contracts";
import { ShieldCheck } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@servexa-warranty-ai/ui/components/collapsible";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";

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
  return (
    <Collapsible defaultOpen className={cn("border-t border-border px-2 py-2", className)}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium hover:bg-muted">
        <ShieldCheck className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        Warranty eligibility
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 px-2 pb-2 text-xs">
        <p>
          <span className="font-medium text-foreground">Status: </span>
          <span className="text-muted-foreground">{statusLabel[eligibility.status]}</span>
        </p>
        <p className="text-muted-foreground">{eligibility.reason}</p>
        {eligibility.warrantyForm ? (
          <p>
            <span className="font-medium text-foreground">Form: </span>
            <span className="text-muted-foreground">{eligibility.warrantyForm}</span>
          </p>
        ) : null}
        {eligibility.warrantyServiceType ? (
          <p>
            <span className="font-medium text-foreground">Service: </span>
            <span className="text-muted-foreground">{eligibility.warrantyServiceType}</span>
          </p>
        ) : null}
        {typeof eligibility.confidence === "number" ? (
          <p className="text-muted-foreground">
            Confidence: {Math.round(eligibility.confidence * 100)}%
          </p>
        ) : null}
      </CollapsibleContent>
    </Collapsible>
  );
}
