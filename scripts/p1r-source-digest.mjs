import { resolveEvidenceScope } from "./evidence-scope.mjs";

export const P1R_SCOPE_MANIFEST = "documents/production-readiness/evidence-scopes/p1r.json";

export async function getP1rEvidenceScope(repoRoot) {
  return resolveEvidenceScope(repoRoot, P1R_SCOPE_MANIFEST);
}

export async function computeP1rSourceDigest(repoRoot) {
  return (await getP1rEvidenceScope(repoRoot)).digest;
}
