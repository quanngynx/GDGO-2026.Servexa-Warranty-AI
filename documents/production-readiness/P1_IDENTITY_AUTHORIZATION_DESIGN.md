# P1 Identity, Authorization and Privacy Design

## Boundary and current authorization

This document defines the P1 target. It does not assert that the current runtime implements it. P1D is design-only while P0A lacks Security sign-off and P0B remains blocked.

The canonical decision is:

```text
explicit permission
  + resource scope
  + current ASC assignment and hierarchy
  + active identity and session state
  + business invariants
  = authorization decision
```

Every term is mandatory. Missing, unknown, stale or conflicting security state produces `DENY`. Role names, browser filters, client ASC parameters, wildcard permissions and token claims cannot grant access.

## Authentication architecture

Express is a confidential OIDC BFF. It terminates Authorization Code + PKCE, validates issuer, audience, authorized party, state and nonce, and binds the resulting subject to a pre-provisioned canonical identity. Browser code receives only an opaque `__Host-` cookie with `HttpOnly`, `Secure`, an approved `SameSite` policy and no `Domain` attribute. OAuth access and refresh credentials remain encrypted in the server-side session store.

The business and authorization layers consume a protocol-neutral `AuthenticatedPrincipal`; they do not import OIDC or SAML types. P1R implements OIDC only. SAML metadata and signed/invalid/replay fixtures exercise the identity-provider boundary, but native SAML runtime integration requires a later enterprise constraint.

Normal identities must exist through SCIM before authentication. Runtime JIT creation and email-based binding are prohibited. The canonical key is the unique pair `(issuer, externalSubject)`. Unknown, inactive, ambiguous or deprovisioned subjects fail closed.

## Canonical contracts

```ts
type IdentityStatus =
  | "PROVISIONED"
  | "ACTIVE"
  | "DEACTIVATED"
  | "PSEUDONYMIZED"
  | "PURGED";

interface AuthenticatedPrincipal {
  identityId: string;
  actorRef: string;
  issuer: string;
  externalSubject: string;
  sessionId: string;
  authenticationTime: string;
  authenticationMethods: string[];
  authorizationVersion: bigint;
}

type BusinessScope =
  | "OWN"
  | "ASSIGNED_ASC"
  | "DESCENDANT_ASC"
  | "REGION"
  | "COMPANY";

interface AuthorizationDecision {
  outcome: "ALLOW" | "DENY";
  reasonCode: string;
  identityId: string;
  sessionId: string;
  authorizationVersion: string;
  permission: string;
  resourceType: string;
  resourceId?: string;
  requestedScope?: BusinessScope;
  evaluatedScope?: BusinessScope;
  versions: {
    roles: string[];
    mappings: string[];
    assignments: string[];
    hierarchy: string;
  };
  invariants: Array<{ id: string; passed: boolean }>;
  degraded: boolean;
  evaluatedAt: string;
  correlationId: string;
  traceparent?: string;
}
```

Client responses contain only a sanitized denial. High-impact mutations persist a digest of the canonical decision in the same transaction as business state and durable audit intent.

## Route security contract

```ts
type RouteSecurityPolicy =
  | { classification: "PUBLIC" }
  | { classification: "AUTHENTICATED_NON_ASC" }
  | {
      classification: "ASC_SCOPED";
      permission: Permission;
      resourceType: ResourceType;
      resolver: ResourceResolver;
      allowedScopes: BusinessScope[];
    }
  | {
      classification: "SECURITY_PRIVILEGED";
      permission: Permission;
      requireFreshAuth?: boolean;
      requireMakerChecker?: boolean;
      requireTransactionalRecheck?: boolean;
    };
```

Every route is classified. Missing policy fails CI and startup; missing or unknown policy at runtime denies. `ASC_SCOPED` without permission, resolver/query scope or allowed scopes is invalid. Client input may narrow a server-authorized result set but can never expand it. Authorization failures create security telemetry and audit without raw credentials or unnecessary PII.

## Identity and organizational state

SCIM state is authoritative for lifecycle and provisioning. Express Integration Layer obtains ASC, region and company hierarchy from the external source of truth and stores a versioned authorization snapshot. In the P1 synthetic profile the snapshot is valid for at most 15 minutes. No snapshot, stale snapshot or version conflict denies access. During connector outage, only an unexpired snapshot may be used and every decision is marked degraded.

`IdentityAscAssignment` is a first-class many-to-many entity with status, effective period, source version and optional scoped role. A scoped role can only reduce the identity's effective capabilities or scope. `User.ascCenterId` is a temporary compatibility field and cannot grant or expand authorization.

Authorization caches are keyed by identity and `authorizationVersion`; TTL is not a freshness guarantee. Every protected request checks a fast authoritative version. Version mismatch, unknown freshness or unavailable verification denies. Security-sensitive mutations re-resolve relevant attributes inside the final transaction gate.

## Session and revocation model

Each authentication creates an opaque named session with minimal device metadata, 30-minute idle expiry and a maximum 12-hour absolute lifetime. Enterprise configuration may shorten these limits. Privileged operations require authentication freshness of at most four hours. Break-glass sessions additionally cannot outlive their activation window.

SCIM deprovision, security reset, group/role downgrade or ASC reduction increments `authorizationVersion`, invalidates authorization state and writes a durable revoke-all-sessions command in the same transaction/outbox. Refresh replay revokes the affected session/token family and alerts; risk policy may escalate to account-wide revocation.

## Break-glass boundary

At most two named emergency identities use a credential store and authentication route independent of enterprise SSO. Incident Commander requests activation and a different named Security Approver authorizes it. Activation is bound to an incident, reason, identity and expiry no later than 60 minutes; it never activates from an IdP health check and never auto-renews.

WebAuthn/FIDO2 is the production-preferred second factor. Synthetic TOTP is a conformance fallback, not production-equivalent evidence. Break-glass bypasses only the SSO dependency: permissions, ASC scope, active state, maker-checker, business policy and audit remain mandatory.

