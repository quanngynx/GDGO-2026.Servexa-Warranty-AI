export type RegisteredTool = {
  name: string;
  timeoutMs: number;
  run: (input: unknown) => Promise<unknown>;
};

const registry = new Map<string, RegisteredTool>();

export function registerTool(tool: RegisteredTool): void {
  registry.set(tool.name, tool);
}

export async function invokeTool(
  name: string,
  input: unknown,
): Promise<unknown> {
  const tool = registry.get(name);
  if (!tool) {
    throw new Error(`Unknown tool: ${name}`);
  }
  return await Promise.race([
    tool.run(input),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Tool "${name}" timed out after ${tool.timeoutMs}ms`)), tool.timeoutMs);
    }),
  ]);
}

export function listRegisteredTools(): string[] {
  return [...registry.keys()];
}
