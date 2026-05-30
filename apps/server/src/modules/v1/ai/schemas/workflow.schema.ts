import z from "zod";

export const workflowStepBodySchema = z.object({
  workflowKey: z.enum(["warranty_claim_intake"]),
  status: z.string().min(1),
  event: z.string().min(1),
});

export type WorkflowStepBody = z.infer<typeof workflowStepBodySchema>;

export const toolInvokeBodySchema = z.object({
  name: z.string().min(1),
  payload: z.unknown().optional(),
});

export type ToolInvokeBody = z.infer<typeof toolInvokeBodySchema>;

export const multiAgentCoordinateBodySchema = z.object({
  goal: z.string().trim().min(1),
  tenantId: z.string().trim().optional(),
});

export type MultiAgentCoordinateBody = z.infer<typeof multiAgentCoordinateBodySchema>;
