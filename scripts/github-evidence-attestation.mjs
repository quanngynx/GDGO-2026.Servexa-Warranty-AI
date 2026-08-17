import { spawnSync } from "node:child_process";

export function verifyGithubEvidenceAttestation(bundlePath, signerWorkflow, repository = "quanngynx/servexa-warranty-ai") {
  const result = spawnSync("gh", ["attestation", "verify", bundlePath, "--repo", repository, "--signer-workflow", signerWorkflow], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.error) return { verified: false, reason: result.error.message };
  if (result.status !== 0) return { verified: false, reason: `${result.stdout ?? ""}${result.stderr ?? ""}`.trim() };
  return { verified: true, output: result.stdout.trim() };
}
