# P1 Permission, Role and Separation-of-Duties Matrix

## Permission semantics

Permissions are stable platform capabilities named `resource.action`. Business code authorizes permissions, never role names. Unknown capabilities deny; wildcard `*` is invalid. A semantic change requires a new version and migration rather than silently changing an existing capability.

Initial registry:

| Resource | Capabilities |
| --- | --- |
| Identity | `identity.read`, `identity.manage` |
| Role | `role.read`, `role.author`, `role.approve`, `role.publish` |
| Assignment | `assignment.read`, `assignment.author`, `assignment.approve` |
| Session | `session.read`, `session.revoke` |
| Warranty decision | `warranty_decision.create`, `warranty_decision.decide`, `warranty_decision.override` |
| Warranty exception | `warranty_exception.approve` |
| Execution | `warranty_execution.retry`, `warranty_execution.reconcile`, `warranty_execution.compensate` |
| Policy | `policy.author`, `policy.approve` |
| Audit | `audit.read` |
| Audit export | `audit_export.request`, `audit_export.approve`, `audit_export.generate`, `audit_export.download` |
| Break-glass | `break_glass.request`, `break_glass.activate`, `break_glass.review` |
| Existing ASC resources | `asc_resource.read`, `asc_resource.write`, `asc_resource.decide` |
| Existing HITL | `hitl.read`, `hitl.create`, `hitl.decide`, `hitl.resume` |

P1 implements the registry, authorization evaluation and negative enforcement. Capability names for P2-P4 do not authorize implementing their business handlers early.

## Versioned reference roles

The seed matrix is versioned configuration, not a hardcoded enum.

| Reference role | Default capabilities | Default scope constraints |
| --- | --- | --- |
| Operator | `warranty_decision.create` | OWN and ASSIGNED_ASC |
| Manager | `warranty_decision.decide` | ASSIGNED_ASC or explicitly assigned hierarchy scope |
| Exception Approver | `warranty_exception.approve` | Explicit authority assignment only |
| Reconciliation Operator | `warranty_execution.retry`, `warranty_execution.reconcile` | Assigned operational scope |
| Compensation Approver | `warranty_execution.compensate` | Explicit authority assignment; cannot approve own request |
| Policy Author | `policy.author` | Approved policy namespace |
| Policy Approver | `policy.approve` | Approved policy namespace |
| Audit Export Requester | `audit.read`, `audit_export.request`, `audit_export.download` | Least-data approved scope |
| Audit Export Approver | `audit_export.approve` | Independent approval scope |
| Audit Export Worker | `audit_export.generate` | SYSTEM actor only; no human login |
| Security Admin | Identity, role, assignment, session and break-glass administration | No business permissions by default |
| Platform Operator | Platform operations capabilities defined outside business permissions | No business-data read by default |

Enterprise roles may combine allowed capabilities but remain subject to conflict policies, scoped assignment reduction and runtime invariants.

## Static conflict sets

Static validation evaluates effective capabilities and effective organizational scope across all direct roles, role versions, mappings and ASC assignments.

| Conflict | Rule |
| --- | --- |
| Role author/approver | One identity cannot author and approve the same role change within overlapping scope/effective period |
| Assignment author/approver | One identity cannot author and approve a privilege-expanding assignment change |
| Policy author/approver | One identity cannot author and approve the same policy version |
| Decision maker/checker | Originating actor cannot hold an effective path that permits final decision on the same workflow |
| Normal/exception decision | Normal decider cannot act as exception approver for the same workflow |
| Break-glass request/activate | Requester and activator must be different named actors |
| Export request/approve | Requester and approver must be different named actors |

Custom roles, multiple assignments and cross-ASC hierarchy cannot be composed to bypass a conflict. Conflict is denied and audited.

## Dynamic invariants

- Originating actor cannot approve, reject, override or decide an exception on the same workflow, including admin and break-glass identities.
- AI/system-created work records the human originating actor when one exists.
- Creator may withdraw before decision only when the state machine explicitly permits it; withdrawal is not a decision.
- Privileged actor cannot approve their own effective privilege increase, including indirect changes through role versions, group mappings or ASC expansion.
- Self-revocation or privilege reduction may proceed without a checker when it cannot increase effective privilege.
- Approval binds target version, effective period, reason and change digest. Stale approval denies.

## Audit export invariants

```text
requester != approver
generate.actorType == SYSTEM
generation.requestDigest == approval.requestDigest
download.actor == namedRecipient
request.status == APPROVED
artifact.status == READY
artifact.expiresAt > now
identity.status == ACTIVE
```

Request, approval/rejection, generation attempt/failure, download, expiry and revoke are audited. Artifacts are encrypted, least-data scoped and expire after 24 hours in the synthetic profile.

