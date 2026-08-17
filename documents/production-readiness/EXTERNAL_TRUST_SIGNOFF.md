# External Trust and Gate Sign-off

Repository files are not trust roots. `documents/production-readiness/trust/` is ignored in full, and no approver or evidence signing key is committed.

## GitHub Environment

Create protected Environment `p1-readiness-signoff` and configure:

- `ENGINEERING_ALLOWED_SIGNERS`: one OpenSSH allowed-signers entry for principal `nguyen-minh-quan`.
- `SECURITY_ALLOWED_SIGNERS`: one OpenSSH allowed-signers entry for principal `huynh-hong-hanh`.

The principals must resolve to different public keys controlled by Nguyễn Minh Quân and Huynh Hong Hanh. Private keys remain on approver-owned machines.

## Evidence sequence

1. Commit all owned source; dirty or untracked owned source makes proof fail.
2. Dispatch the P0A full-proof and P1D workflows on the exact commit. CI writes deterministic `bundle.json` files and `actions/attest@v4` attests them with GitHub OIDC.
3. Download each exact evidence artifact and verify it with `gh attestation verify <bundle> --repo quanngynx/servexa-warranty-ai`.
4. Each approver independently creates their attestation JSON according to `attestation.schema.json`, binding the exact registry digest, bundle digest, Git subject, workflow run/attempt and GitHub attestation reference.
5. Each approver signs the unchanged JSON:

   ```powershell
   ssh-keygen -Y sign -f <approver-private-key> -n servexa-gate <attestation.json>
   ```

6. Commit the two JSON files and detached `.sig` files, mark both gate sign-offs `APPROVED`, and set gate status to `CLOSED` only in the closure PR.
7. Dispatch `P1 Readiness Gate Closure` with exact artifact names and run IDs. The job re-verifies GitHub provenance, both OpenSSH signatures, distinct principals, evidence binding and findings policy.

Local proof remains `LOCAL_UNATTESTED`. A README, review draft, manually edited status or locally generated key can never close a gate.
