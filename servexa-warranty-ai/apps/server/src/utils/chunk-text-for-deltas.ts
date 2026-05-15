export function chunkTextForDeltas(text: string, size: number = 24): string[] {

  const t = text.trim() || " ";
  if (t.length <= 1) return [t];

  const chars = Array.from(t); 
  const chunks: string[] = [];

  for (let i = 0; i < chars.length; i += size) {
    chunks.push(chars.slice(i, i + size).join(''));
  }
  return chunks.length ? chunks : [" "];
}
