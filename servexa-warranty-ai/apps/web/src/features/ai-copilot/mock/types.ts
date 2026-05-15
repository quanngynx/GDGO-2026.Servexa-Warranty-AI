/** Evidence contract aligned with warranty copilot proposal (UI may parse from assistant text later). */
export type CopilotEvidenceSourceType = "manual" | "repair_case" | "policy" | "inventory";

export type CopilotEvidenceSource = {
  id: string;
  title: string;
  type: CopilotEvidenceSourceType;
  excerpt?: string;
};

export type CopilotSuggestedAction = {
  label: string;
  action: string;
};

export type CopilotResponse = {
  answer: string;
  confidence: number;
  sources: CopilotEvidenceSource[];
  suggestedActions: CopilotSuggestedAction[];
};
