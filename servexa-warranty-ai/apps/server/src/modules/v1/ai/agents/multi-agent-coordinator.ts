import { completeUnaryPrompt } from "@/modules/v1/ai/runtime/ai-completion-runtime";

export type MultiAgentPlan = {
  steps: string[];
  reasoning: string;
};

/**
 * Lightweight coordinator: planner (single LLM call) then executor (second call). Extend with real agent graphs later.
 */
export class MultiAgentCoordinator {
  async planAndExecute(input: {
    goal: string;
    traceId: string;
    userId: string;
    tenantId: string;
    role: string;
  }): Promise<{ plan: MultiAgentPlan; result: string }> {
    const planPrompt = `You are a planner. Output 3-5 short bullet steps only, then one line REASONING: ... for: ${input.goal}`;
    const planOut = await completeUnaryPrompt({
      prompt: planPrompt,
      traceId: input.traceId,
      userId: input.userId,
      tenantId: input.tenantId,
      role: input.role,
      contextJson: JSON.stringify({ agent: "planner" }),
    });
    const steps = planOut.text
      .split("\n")
      .map((l) => l.replace(/^[-*]\s*/, "").trim())
      .filter(Boolean)
      .slice(0, 8);

    const execPrompt = `Execute mentally the following plan for the user goal and produce the final user-facing answer.\nPlan:\n${steps.join("\n")}\n\nGoal: ${input.goal}`;
    const execOut = await completeUnaryPrompt({
      prompt: execPrompt,
      traceId: input.traceId,
      userId: input.userId,
      tenantId: input.tenantId,
      role: input.role,
      contextJson: JSON.stringify({ agent: "executor" }),
    });

    return {
      plan: { steps, reasoning: planOut.text },
      result: execOut.text,
    };
  }
}
