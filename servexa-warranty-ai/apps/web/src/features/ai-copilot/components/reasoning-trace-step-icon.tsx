import type { ReasoningTraceEvent } from "@servexa-warranty-ai/ai-contracts";

import {
  AlertTriangle,
  CheckCircle2,
  GitBranch,
  ListChecks,
  Loader2,
  SearchIcon,
  Sparkles,
  UserCheck,
  Wrench,
} from "lucide-react";

type ReasoningTraceStepIconProps = {
  type: ReasoningTraceEvent["type"];
  className?: string;
};

export function ReasoningTraceStepIcon({
  type,
  className,
}: ReasoningTraceStepIconProps) {
  const common = { className, "aria-hidden": true };

  switch (type) {
    case "routing":
      return <ListChecks {...common} />;
    case "retrieval":
      return <SearchIcon {...common} />;
    case "rerank":
      return <ListChecks {...common} />;
    case "tool":
      return <Wrench {...common} />;
    case "hitl":
      return <UserCheck {...common} />;
    case "workflow":
      return <GitBranch {...common} />;
    case "generation":
      return <Sparkles {...common} />;
    case "finalization":
      return <CheckCircle2 {...common} />;
    case "error":
      return <AlertTriangle {...common} />;
    case "run":
    default:
      return <Loader2 {...common} />;
  }
}

