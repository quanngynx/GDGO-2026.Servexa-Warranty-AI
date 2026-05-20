function parseContextValue(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  if (typeof value === "string" && value.trim().startsWith("{")) {
    try {
      const parsed: unknown = JSON.parse(value);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return null;
    }
  }
  return null;
}

/** CopilotKit `useAgentContext` entries and nested AG-UI context payloads. */
export function flattenCopilotContext(raw: unknown): Record<string, unknown> {
  const merged: Record<string, unknown> = {};

  const absorb = (entry: unknown): void => {
    if (entry == null) return;
    if (Array.isArray(entry)) {
      for (const item of entry) absorb(item);
      return;
    }
    if (typeof entry !== "object") return;

    const obj = entry as Record<string, unknown>;
    const parsedValue = parseContextValue(obj.value);
    if (parsedValue) {
      mergeValue(merged, parsedValue);
      return;
    }

    for (const [key, child] of Object.entries(obj)) {
      if (key === "description") continue;
      if (child && typeof child === "object") absorb(child);
      else mergeScalar(merged, key, child);
    }
  };

  absorb(raw);
  return merged;
}

function mergeValue(target: Record<string, unknown>, patch: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(patch)) {
    mergeScalar(target, key, value);
  }
}

function mergeScalar(target: Record<string, unknown>, key: string, value: unknown): void {
  if (value === undefined) return;
  if (isEmpty(value)) {
    if (!(key in target)) target[key] = value;
    return;
  }
  target[key] = value;
}

function isEmpty(value: unknown): boolean {
  return value === null || value === "" || value === false;
}
