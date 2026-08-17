import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const definitions = {
  p0a: { root: ".p0a/evidence", registry: ".p0a/evidence/registry.json" },
  p1d: { root: ".p1d/evidence", registry: ".p1d/evidence/registry.json" },
};

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const normalize = (value) => value.replaceAll("\\", "/");

export async function createEvidenceBundle(gate) {
  const definition = definitions[gate];
  if (!definition) throw new Error(`unsupported evidence bundle gate: ${gate}`);
  const registryPath = path.join(repoRoot, definition.registry);
  const registryBytes = await readFile(registryPath);
  const registry = JSON.parse(registryBytes.toString("utf8"));
  const artifactReferences = gate === "p0a"
    ? (registry.records ?? []).flatMap((record) => record.artifacts ?? []).map((artifact) => artifact.path)
    : (registry.evidence ?? []).map((record) => path.join(definition.root, record.artifact));
  const artifacts = [];
  for (const relativePath of [...new Set(artifactReferences.map(normalize))].sort()) {
    const absolutePath = path.resolve(repoRoot, relativePath);
    const evidenceRoot = path.resolve(repoRoot, definition.root);
    if (!absolutePath.startsWith(`${evidenceRoot}${path.sep}`)) throw new Error(`bundle artifact escapes evidence root: ${relativePath}`);
    const bytes = await readFile(absolutePath);
    artifacts.push({ path: relativePath, sha256: sha256(bytes), size: bytes.length });
  }
  const source = gate === "p0a"
    ? { commit: registry.subjectCommit, tree: registry.subjectTree, digest: registry.sourceDigest }
    : { commit: registry.source?.commit, tree: registry.source?.tree, digest: registry.source?.digest };
  const workflow = gate === "p0a"
    ? { runId: registry.workflowRunId, attempt: registry.workflowRunAttempt }
    : registry.workflow;
  const bundle = {
    schemaVersion: "1.0",
    gate: gate.toUpperCase(),
    repository: "quanngynx/servexa-warranty-ai",
    source,
    workflow,
    registry: { path: definition.registry, sha256: sha256(registryBytes), size: registryBytes.length },
    artifacts,
  };
  const outputPath = path.join(repoRoot, definition.root, "bundle.json");
  await writeFile(outputPath, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");
  return outputPath;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const output = await createEvidenceBundle(process.argv[2]);
  console.log(path.relative(repoRoot, output).replaceAll("\\", "/"));
}
