import { resolveEvidenceScope } from "./evidence-scope.mjs";

export const P1D_SCOPE_MANIFEST = "documents/production-readiness/evidence-scopes/p1d.json";

export async function getP1dEvidenceScope(repoRoot) {
  return resolveEvidenceScope(repoRoot, P1D_SCOPE_MANIFEST);
}

export async function computeP1SourceDigest(repoRoot) {
  return (await getP1dEvidenceScope(repoRoot)).digest;
}
