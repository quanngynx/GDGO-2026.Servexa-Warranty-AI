import type { DiagnosisDraft } from "@servexa-warranty-ai/ai-contracts";
import { Stethoscope } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@servexa-warranty-ai/ui/components/collapsible";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";
import { useTranslation } from "react-i18next";

type DiagnosisDraftCardProps = {
  diagnosis: DiagnosisDraft;
  className?: string;
};

function BulletList({ title, items }: { title: string; items: string[] }) {
    const { t } = useTranslation();
  if (!items.length) return null;
  return (
    <div>
      <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <ul className="list-inside list-disc space-y-0.5 text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function DiagnosisDraftCard({ diagnosis, className }: DiagnosisDraftCardProps) {
    const { t } = useTranslation();
  return (
    <Collapsible defaultOpen className={cn("border-t border-border px-2 py-2", className)}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium hover:bg-muted">
        <Stethoscope className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        {t("Diagnosis draft")}</CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 px-2 pb-2 text-xs">
        <p>
          <span className="font-medium text-foreground">{t("Severity:")}</span>
          <span className="capitalize text-muted-foreground">{diagnosis.severity}</span>
        </p>
        <BulletList title={t("Symptoms")} items={diagnosis.symptoms} />
        <BulletList title={t("Possible causes")} items={diagnosis.possibleCauses} />
        <BulletList title={t("Recommended checks")} items={diagnosis.recommendedChecks} />
      </CollapsibleContent>
    </Collapsible>
  );
}
