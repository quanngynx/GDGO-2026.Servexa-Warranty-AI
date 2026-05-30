/**
 * Minimal evaluation harness hooks — extend with golden datasets / CI runners.
 */
export type RetrievalEvalCase = {
  id: string;
  query: string;
  expectSnippet: string;
};

export type EvalResult = {
  passed: number;
  failed: string[];
  errors: { id: string; error: unknown }[];
  // Calculate the Mean Reciprocal Rank to know if the search engine is ranking well
  meanReciprocalRank: number; 
};

/**
 * Function to normalize text to avoid False Negatives due to whitespace/case differences
 * @returns Normalized text
 */
const normalizeText = (text: string) => text.toLowerCase().replace(/\s+/g, " ").trim();

/**
 * Function to run the retrieval smoke cases
 * @param search: Function to search for the query
 * @param cases: Array of cases to evaluate
 * @returns Evaluation result
 */
export async function runRetrievalSmokeCases(
  search: (query: string) => Promise<{ text: string }[]>,
  cases: RetrievalEvalCase[],
): Promise<EvalResult> {
  const failed: string[] = [];
  const errors: { id: string; error: unknown }[] = [];

  let passed = 0;
  let sumReciprocalRank = 0;

  for (const c of cases) {
    try {
      const hits = await search(c.query);
      const expectedTarget = normalizeText(c.expectSnippet);

      // Find the position (rank) of the first matching result
      const hitIndex = hits.findIndex((h) => 
        normalizeText(h.text).includes(expectedTarget)
      );

      if (hitIndex !== -1) {
        passed += 1;
        // Top 1 = 1 point, Top 2 = 0.5 point...
        sumReciprocalRank += 1 / (hitIndex + 1);
      } else {
        failed.push(c.id);
      }
    } catch (error) {
      errors.push({ id: c.id, error: error });
    }
  }
  return { 
    passed, 
    failed, 
    errors,
    meanReciprocalRank: cases.length > 0 ? sumReciprocalRank / cases.length : 0
  };
}
