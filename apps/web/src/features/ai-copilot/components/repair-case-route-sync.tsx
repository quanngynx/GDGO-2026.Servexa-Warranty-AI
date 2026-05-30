import { useSearch } from "@tanstack/react-router";
import { useEffect } from "react";

import { useOperationalContextPatch } from "../context/operational-context-provider";

/** Syncs `?caseId=` search param into operational context for the copilot. */
export function RepairCaseRouteSync() {
  const search = useSearch({ strict: false }) as { caseId?: string };
  const { setOperationalContext } = useOperationalContextPatch();

  useEffect(() => {
    if (search.caseId) {
      setOperationalContext({ repairCaseId: search.caseId });
    }
  }, [search.caseId, setOperationalContext]);

  return null;
}
