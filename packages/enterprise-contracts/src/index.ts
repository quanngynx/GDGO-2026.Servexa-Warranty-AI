import { z } from "zod";

export const enterpriseErrorCodeSchema = z.enum([
  "UNAUTHORIZED",
  "RATE_LIMITED",
  "UNAVAILABLE",
  "CONFLICT",
  "AMBIGUOUS_RESULT",
  "SCHEMA_MISMATCH",
  "NOT_FOUND",
]);

export const traceContextSchema = z.object({
  correlationId: z.string().min(1).max(128),
  traceparent: z
    .string()
    .regex(/^00-[0-9a-f]{32}-[0-9a-f]{16}-0[01]$/i)
    .optional(),
});

export const enterprisePrincipalSchema = z.object({
  subject: z.string().min(1),
  email: z.string().email(),
  displayName: z.string().min(1),
  groups: z.array(z.string().min(1)),
  ascIds: z.array(z.string().min(1)),
  active: z.boolean(),
});

export const provisioningEventSchema = z.object({
  eventId: z.string().min(1),
  operation: z.enum(["CREATE", "UPDATE", "DEACTIVATE", "GROUP_SYNC"]),
  principal: enterprisePrincipalSchema,
  occurredAt: z.string().datetime(),
});

export const warrantyCaseContextSchema = z.object({
  externalCaseId: z.string().min(1),
  version: z.string().min(1),
  ascId: z.string().min(1),
  status: z.string().min(1),
  productCode: z.string().min(1),
  policyVersion: z.string().min(1),
  updatedAt: z.string().datetime(),
});

export const executeWarrantyDecisionCommandSchema = z.object({
  workflowId: z.string().min(1),
  decisionVersion: z.number().int().positive(),
  externalCaseId: z.string().min(1),
  expectedCaseVersion: z.string().min(1),
  outcome: z.enum(["ELIGIBLE", "INELIGIBLE"]),
  decidedBy: z.string().min(1),
  trace: traceContextSchema,
});

export const executionReceiptSchema = z.object({
  externalExecutionId: z.string().min(1),
  idempotencyKey: z.string().min(1),
  status: z.enum(["ACCEPTED", "EXECUTED", "FAILED", "UNKNOWN"]),
  externalCaseVersion: z.string().min(1).optional(),
  confirmedAt: z.string().datetime().optional(),
});

export const executionStatusRequestSchema = z.object({
  externalExecutionId: z.string().min(1),
  trace: traceContextSchema,
});

export const reconciliationRequestSchema = z.object({
  workflowId: z.string().min(1),
  decisionVersion: z.number().int().positive(),
  externalExecutionId: z.string().min(1).optional(),
  trace: traceContextSchema,
});

export const reconciliationResultSchema = z.object({
  status: z.enum(["MATCHED", "MISMATCH", "NOT_FOUND", "AMBIGUOUS"]),
  externalCaseVersion: z.string().min(1).optional(),
  details: z.string().max(2000).optional(),
});

export const enterpriseErrorSchema = z.object({
  ok: z.literal(false),
  error: z.object({
    code: enterpriseErrorCodeSchema,
    message: z.string().min(1),
    retryable: z.boolean(),
    correlationId: z.string().min(1),
  }),
});

export const aiProviderRequestSchema = z.object({
  requestId: z.string().min(1),
  task: z.enum(["GENERATE", "EMBED"]),
  sanitizedInput: z.string().min(1).max(20_000),
  dataClasses: z.array(z.enum(["PUBLIC", "INTERNAL"])),
  trace: traceContextSchema,
}).strict();

export const aiProviderResponseSchema = z.object({
  requestId: z.string().min(1),
  output: z.string().optional(),
  embedding: z.array(z.number()).optional(),
  retained: z.literal(false),
  trainedOnInput: z.literal(false),
});

export function warrantyExecutionIdempotencyKey(
  workflowId: string,
  decisionVersion: number,
): string {
  return `${workflowId}:${decisionVersion}`;
}

export interface WarrantySystemAdapter {
  getCaseContext(
    externalCaseId: string,
    trace: TraceContext,
  ): Promise<WarrantyCaseContext>;
  executeWarrantyDecision(
    command: ExecuteWarrantyDecisionCommand,
  ): Promise<ExecutionReceipt>;
  getExecutionStatus(
    request: ExecutionStatusRequest,
  ): Promise<ExecutionReceipt>;
  reconcileDecision(
    request: ReconciliationRequest,
  ): Promise<ReconciliationResult>;
}

export class EnterpriseAdapterError extends Error {
  constructor(
    public readonly code: EnterpriseErrorCode,
    message: string,
    public readonly retryable: boolean,
    public readonly correlationId: string,
  ) {
    super(message);
    this.name = "EnterpriseAdapterError";
  }
}

type FetchLike = typeof fetch;

export class ReferenceWarrantySystemAdapter implements WarrantySystemAdapter {
  constructor(
    private readonly baseUrl: string,
    private readonly fetchImpl: FetchLike = fetch,
  ) {}

  private async parse<T>(response: Response, schema: z.ZodType<T>): Promise<T> {
    const body: unknown = await response.json();
    if (!response.ok) {
      const failure = enterpriseErrorSchema.parse(body);
      throw new EnterpriseAdapterError(
        failure.error.code,
        failure.error.message,
        failure.error.retryable,
        failure.error.correlationId,
      );
    }
    return schema.parse(body);
  }

  async getCaseContext(externalCaseId: string, trace: TraceContext): Promise<WarrantyCaseContext> {
    const response = await this.fetchImpl(`${this.baseUrl}/v1/cases/${encodeURIComponent(externalCaseId)}`, {
      headers: { "x-correlation-id": trace.correlationId, ...(trace.traceparent ? { traceparent: trace.traceparent } : {}) },
    });
    return this.parse(response, warrantyCaseContextSchema);
  }

  async executeWarrantyDecision(command: ExecuteWarrantyDecisionCommand): Promise<ExecutionReceipt> {
    const response = await this.fetchImpl(`${this.baseUrl}/v1/warranty-decisions/executions`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-correlation-id": command.trace.correlationId, "idempotency-key": warrantyExecutionIdempotencyKey(command.workflowId, command.decisionVersion), ...(command.trace.traceparent ? { traceparent: command.trace.traceparent } : {}) },
      body: JSON.stringify(command),
    });
    return this.parse(response, executionReceiptSchema);
  }

  async getExecutionStatus(request: ExecutionStatusRequest): Promise<ExecutionReceipt> {
    const response = await this.fetchImpl(`${this.baseUrl}/v1/warranty-decisions/executions/${encodeURIComponent(request.externalExecutionId)}`, {
      headers: { "x-correlation-id": request.trace.correlationId, ...(request.trace.traceparent ? { traceparent: request.trace.traceparent } : {}) },
    });
    return this.parse(response, executionReceiptSchema);
  }

  async reconcileDecision(request: ReconciliationRequest): Promise<ReconciliationResult> {
    const response = await this.fetchImpl(`${this.baseUrl}/v1/warranty-decisions/reconciliation`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-correlation-id": request.trace.correlationId, ...(request.trace.traceparent ? { traceparent: request.trace.traceparent } : {}) },
      body: JSON.stringify(request),
    });
    return this.parse(response, reconciliationResultSchema);
  }
}

export type EnterpriseErrorCode = z.infer<typeof enterpriseErrorCodeSchema>;
export type TraceContext = z.infer<typeof traceContextSchema>;
export type EnterprisePrincipal = z.infer<typeof enterprisePrincipalSchema>;
export type ProvisioningEvent = z.infer<typeof provisioningEventSchema>;
export type WarrantyCaseContext = z.infer<typeof warrantyCaseContextSchema>;
export type ExecuteWarrantyDecisionCommand = z.infer<typeof executeWarrantyDecisionCommandSchema>;
export type ExecutionReceipt = z.infer<typeof executionReceiptSchema>;
export type ExecutionStatusRequest = z.infer<typeof executionStatusRequestSchema>;
export type ReconciliationRequest = z.infer<typeof reconciliationRequestSchema>;
export type ReconciliationResult = z.infer<typeof reconciliationResultSchema>;
export type AiProviderRequest = z.infer<typeof aiProviderRequestSchema>;
export type AiProviderResponse = z.infer<typeof aiProviderResponseSchema>;
