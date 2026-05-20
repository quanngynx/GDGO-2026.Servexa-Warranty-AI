export type QuickPromptItem = { title: string; message: string };

/** Operational presets for copilot suggestions and programmatic quick prompts. */
export const OPERATIONAL_QUICK_PROMPTS: QuickPromptItem[] = [
  { title: "Summarize case", message: "Summarize this repair case for a technician handoff." },
  { title: "Similar failures", message: "Find similar repair failures and likely root causes." },
  { title: "Warranty eligibility", message: "Explain warranty eligibility for the current context." },
  { title: "SLA risk", message: "Detect SLA risk for this repair case." },
  { title: "Manuals", message: "Search technical manuals relevant to this situation." },
  { title: "Next action", message: "Suggest the next operational action for this case." },
  { title: "Supply chain", message: "Detect supply chain risk for parts on this case." },
];
