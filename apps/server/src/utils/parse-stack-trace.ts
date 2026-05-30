export function parseStackTrace(
  stack?: string
): Array<{ function: string; file: string; line: number; column: number }> {
  if (!stack) return [];

  const lines = stack.split("\n").slice(1); // remove "Error: ..."
  const frames = lines.map((line) => {
    const match = line.trim().match(/^at\s+(.*?)\s+\((.*?):(\d+):(\d+)\)$/);
    if (!match) return null;

    const [, func, file, lineNum, colNum] = match;
    return {
      function: func || "anonymous",
      file,
      line: Number(lineNum),
      column: Number(colNum),
    };
  });

  return frames.filter(Boolean) as Array<{
    function: string;
    file: string;
    line: number;
    column: number;
  }>;
}
