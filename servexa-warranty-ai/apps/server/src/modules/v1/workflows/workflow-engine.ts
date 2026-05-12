export type WorkflowTransitionMap = Record<string, Record<string, string>>;

export type WorkflowDefinition = {
  key: string;
  initialStatus: string;
  transitions: WorkflowTransitionMap;
};

export class WorkflowEngine {
  runTransition(
    definition: WorkflowDefinition,
    currentStatus: string,
    event: string,
  ): { nextStatus: string; terminal: boolean } {
    const from = definition.transitions[currentStatus];
    if (!from) {
      throw new Error(`Unknown workflow status: ${currentStatus}`);
    }
    const next = from[event];
    if (!next) {
      throw new Error(`Invalid transition "${event}" from "${currentStatus}"`);
    }
    const terminal = !definition.transitions[next] || Object.keys(definition.transitions[next]).length === 0;
    return { nextStatus: next, terminal };
  }
}
