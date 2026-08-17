# P0A Engineering Attestation Review

- Approver: Nguyễn Minh Quân
- Role: Engineering
- Decision: PENDING_REMEDIATION
- Review prepared: 2026-08-17
- Evidence registry: `.p0a/evidence/registry.json`
- Registry SHA-256: `07880716b7e2936289fb8bfd18ccddcc0ec3049e9e2fcf43be816d0ad0d9bd83`
- Claimed subject commit: `dd675d939ddaae5574142000df387f14c7d38772`
- Claimed subject tree: `4768c1476d98adef89bb8b9587ca842236329306`
- Ownership digest: `sha256:c1132596e6d3e2466ed97e0398bdcdb1e559700c9bafb37aeb98ec925439a2f0`

## Verified evidence

- Seven P0A proof groups report `PASSED` and their artifact checksums validate.
- Full synthetic topology, identity fixtures, AI redaction, network isolation, telemetry, backup/restore and fixed capacity profiles ran successfully on 2026-08-17.
- P0A teardown removed only the `servexa-p0a` Compose resources.
- P0B remains blocked and no production-readiness claim is made.

## Blocking findings

1. **Critical — Git subject binding is not reproducible.** The registry records the current `HEAD`, but P0A-owned files are modified/untracked and absent from that commit. The ownership digest therefore describes the working tree, not the claimed Git tree.
2. **High — evidence trust root is self-supplied.** The registry embeds the public key corresponding to a locally generated private key. Replacing both registry content and key pair can still produce a valid signature.
3. **High — dependency closure detects invalid declared edges but cannot detect an omitted import, Compose context, workflow reference or transitive dependency.
4. **High — sign-off validation accepts any existing file and does not bind a structured human attestation to this exact registry digest.

## Required before approval

- Commit the complete owned source, re-run P0A proof from that clean immutable subject, and prove every owned file is reconstructible from it.
- Pin the evidence signer to an independently trusted key or CI identity.
- Add discoverable dependency-closure coverage and omission tests.
- Validate a structured attestation schema containing approver, role, decision, timestamp, reviewed registry digest, finding disposition and signature/verified identity.

This document is a review draft. It is not Nguyễn Minh Quân's approval or signature.
