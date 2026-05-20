import type { WorkflowDefinition } from "./workflow-engine";

export const warrantyClaimIntakeWorkflow: WorkflowDefinition = {
  key: "warranty_claim_intake",
  initialStatus: "draft",
  transitions: {
    draft: { submit: "submitted" },
    submitted: { approve: "reviewed", reject: "draft", escalate: "escalated" },
    reviewed: { close: "closed" },
    escalated: { resolve: "reviewed" },
    closed: {},
  },
};
