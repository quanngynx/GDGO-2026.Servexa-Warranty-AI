import { resolveEvidenceScope } from "./evidence-scope.mjs";

export const P0A_SCOPE_MANIFEST = "documents/production-readiness/evidence-scopes/p0a.json";

export async function getP0aEvidenceScope(repoRoot) {
  return resolveEvidenceScope(repoRoot, P0A_SCOPE_MANIFEST);
}

export async function computeP0aSourceDigest(repoRoot) {
  return (await getP0aEvidenceScope(repoRoot)).digest;
}
