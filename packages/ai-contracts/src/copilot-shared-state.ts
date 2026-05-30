import {
  diagnosisDraftSchema,
  selectedCaseSummarySchema,
  warrantyEligibilitySchema,
  type DiagnosisDraft,
  type SelectedCaseSummary,
  type WarrantyEligibility,
} from "./copilot-response";

function strOrNull(v: unknown): string | null | undefined {
  if (v === null) return null;
  if (v === undefined) return undefined;
  const s = String(v).trim();
  return s.length ? s : undefined;
}

function pickString(obj: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

/** Build selectedCaseSummary from flattened execution context or nested snapshot. */
export function parseSelectedCaseSummaryFromExecutionContext(
  flat: Record<string, unknown>,
): SelectedCaseSummary | undefined {
  const snapshot =
    flat.repairCaseSnapshot && typeof flat.repairCaseSnapshot === "object"
      ? (flat.repairCaseSnapshot as Record<string, unknown>)
      : flat.selectedCaseSummary && typeof flat.selectedCaseSummary === "object"
        ? (flat.selectedCaseSummary as Record<string, unknown>)
        : null;

  const source = snapshot ?? flat;
  const repairCaseId =
    pickString(source, "repairCaseId", "repair_case_id") ??
    pickString(flat, "repairCaseId", "repair_case_id");

  if (!repairCaseId) return undefined;

  const raw = {
    repairCaseId,
    caseNumber: pickString(source, "caseNumber", "case_number") ?? pickString(flat, "caseNumber", "case_number"),
    status: pickString(source, "status") ?? pickString(flat, "status"),
    priority: pickString(source, "priority") ?? pickString(flat, "priority"),
    customerName: pickString(source, "customerName", "customer_name"),
    customerPhone: pickString(source, "customerPhone", "customer_phone"),
    productModel: strOrNull(source.productModel ?? source.product_model ?? flat.productModel),
    modelCode: strOrNull(source.modelCode ?? source.model_code),
    serialNumber: pickString(source, "serialNumber", "serial_number"),
    warrantyForm: strOrNull(source.warrantyForm ?? source.warranty_form),
    warrantyServiceType: strOrNull(source.warrantyServiceType ?? source.warranty_service_type),
    errorPhenomena: strOrNull(source.errorPhenomena ?? source.error_phenomena),
    promisedDeliveryDate: strOrNull(
      source.promisedDeliveryDate ?? source.promised_delivery_date,
    ),
  };

  const parsed = selectedCaseSummarySchema.safeParse(raw);
  return parsed.success ? parsed.data : undefined;
}

/** Parse diagnosis draft from AI metadata; returns undefined when invalid. */
export function parseDiagnosisDraft(raw: unknown): DiagnosisDraft | undefined {
  const parsed = diagnosisDraftSchema.safeParse(raw);
  return parsed.success ? parsed.data : undefined;
}

/** Heuristic diagnosis when LLM metadata is missing or invalid. */
export function buildHeuristicDiagnosisDraft(
  snapshot: Record<string, unknown> | SelectedCaseSummary | null | undefined,
): DiagnosisDraft {
  const src =
    snapshot && typeof snapshot === "object" ? snapshot : ({} as Record<string, unknown>);
  const symptom =
    pickString(src as Record<string, unknown>, "errorPhenomena", "error_phenomena") ??
    "No symptom recorded on the repair case.";
  const product =
    pickString(src as Record<string, unknown>, "productModel", "product_model") ?? "device";
  const serial =
    pickString(src as Record<string, unknown>, "serialNumber", "serial_number") ?? "unknown serial";

  const draft = {
    symptoms: [symptom],
    possibleCauses: [
      `Hardware fault related to reported symptom on ${product}.`,
      "Configuration or firmware issue after recent service.",
    ],
    recommendedChecks: [
      `Verify serial ${serial} against warranty records.`,
      "Run standard diagnostic checklist for the reported symptom.",
      "Inspect power and connectivity before parts replacement.",
    ],
    severity: "medium" as const,
  };

  const parsed = diagnosisDraftSchema.safeParse(draft);
  return parsed.success ? parsed.data : diagnosisDraftSchema.parse({
    symptoms: [symptom],
    possibleCauses: ["Further inspection required."],
    recommendedChecks: ["Review repair case notes and run diagnostics."],
    severity: "low",
  });
}

export function mergePhase3RailFields(
  rail: Record<string, unknown>,
  executionContext?: Record<string, unknown>,
): Record<string, unknown> {
  const merged = { ...rail };

  if (!merged.selectedCaseSummary && executionContext) {
    const summary = parseSelectedCaseSummaryFromExecutionContext(executionContext);
    if (summary) merged.selectedCaseSummary = summary;
  }

  const snapshot =
    (merged.selectedCaseSummary as SelectedCaseSummary | undefined) ??
    (executionContext ? parseSelectedCaseSummaryFromExecutionContext(executionContext) : undefined);

  const parsedDx = parseDiagnosisDraft(merged.diagnosisDraft);
  if (parsedDx) {
    merged.diagnosisDraft = parsedDx;
  } else if (snapshot) {
    merged.diagnosisDraft = buildHeuristicDiagnosisDraft(snapshot);
  }

  const parsedWarranty = warrantyEligibilitySchema.safeParse(merged.warrantyEligibility);
  if (parsedWarranty.success) {
    merged.warrantyEligibility = parsedWarranty.data;
  } else {
    delete merged.warrantyEligibility;
  }

  return merged;
}

export function parseWarrantyEligibility(raw: unknown): WarrantyEligibility | undefined {
  const parsed = warrantyEligibilitySchema.safeParse(raw);
  return parsed.success ? parsed.data : undefined;
}
