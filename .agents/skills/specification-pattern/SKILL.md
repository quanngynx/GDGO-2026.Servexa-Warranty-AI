---
name: Specification Pattern
description: This skill should be used when the user asks to "implement the specification pattern", "create a business rule specification", "build composable filters", "combine specifications with AND/OR/NOT", "apply domain-driven design filtering", "validate entities with specifications", "create reusable query predicates", or needs to encapsulate business rules as first-class objects in TypeScript.
version: 0.1.0
---

# Specification Pattern in TypeScript

The Specification Pattern encapsulates a single business rule as a composable, reusable object. Specifications can be combined with logical operators (`and`, `or`, `not`) to express complex rules without scattering `if` conditionals across the codebase. This pattern is a core tactical pattern in Domain-Driven Design (DDD) and is especially valuable for filtering entities, validating domain objects, and constructing dynamic queries.

## Core Concepts

### The Specification Interface

Define a generic interface that all specifications implement:

```typescript
interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean
  and(other: Specification<T>): Specification<T>
  or(other: Specification<T>): Specification<T>
  not(): Specification<T>
}
```

### Abstract Base Class

Provide a base class so concrete specifications only implement `isSatisfiedBy`:

```typescript
abstract class CompositeSpecification<T> implements Specification<T> {
  abstract isSatisfiedBy(candidate: T): boolean

  and(other: Specification<T>): Specification<T> {
    return new AndSpecification(this, other)
  }

  or(other: Specification<T>): Specification<T> {
    return new OrSpecification(this, other)
  }

  not(): Specification<T> {
    return new NotSpecification(this)
  }
}
```

### Composite Operators

```typescript
class AndSpecification<T> extends CompositeSpecification<T> {
  constructor(
    private readonly left: Specification<T>,
    private readonly right: Specification<T>,
  ) { super() }

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) && this.right.isSatisfiedBy(candidate)
  }
}

class OrSpecification<T> extends CompositeSpecification<T> {
  constructor(
    private readonly left: Specification<T>,
    private readonly right: Specification<T>,
  ) { super() }

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) || this.right.isSatisfiedBy(candidate)
  }
}

class NotSpecification<T> extends CompositeSpecification<T> {
  constructor(private readonly spec: Specification<T>) { super() }

  isSatisfiedBy(candidate: T): boolean {
    return !this.spec.isSatisfiedBy(candidate)
  }
}
```

## Implementation Workflow

**Step 1 – Define the domain entity** that specifications will target (e.g., `Order`, `User`, `Product`).

**Step 2 – Identify atomic business rules** — each rule becomes one concrete specification class extending `CompositeSpecification<T>`.

**Step 3 – Compose rules** using `.and()`, `.or()`, `.not()` at the call site (service or use-case layer).

**Step 4 – Apply to collections** using `.filter()` or pass to a repository that translates specs to queries.

**Step 5 – Optional: add query translation** so specs drive Prisma `where` clauses (see `references/query-translation.md`).

## Concrete Example — Warranty Domain

```typescript
// Entity
interface RepairCase {
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
  warrantyExpiresAt: Date
  customerId: string
}

// Atomic specification
class IsUnderWarrantySpec extends CompositeSpecification<RepairCase> {
  isSatisfiedBy(c: RepairCase): boolean {
    return c.warrantyExpiresAt > new Date()
  }
}

class IsOpenCaseSpec extends CompositeSpecification<RepairCase> {
  isSatisfiedBy(c: RepairCase): boolean {
    return c.status === 'OPEN'
  }
}

// Composition at the service layer
const eligibleForAutoClose = new IsUnderWarrantySpec()
  .not()
  .and(new IsOpenCaseSpec())

const cases: RepairCase[] = await repairCaseRepo.findAll()
const toClose = cases.filter(c => eligibleForAutoClose.isSatisfiedBy(c))
```

## TypeScript-Specific Rules

- **No `any`** — use `unknown` with type guards when narrowing is needed inside a spec.
- **Generic constraints** — prefer `Specification<T>` over non-generic base classes.
- **Immutable specs** — mark all constructor parameters `readonly`.
- **Single responsibility** — each spec class encapsulates exactly one rule; compose at call sites.
- **Strict mode** — all spec files must compile under `"strict": true`.
- **Naming** — suffix concrete specs with `Spec` (e.g., `IsActiveUserSpec`, `HasValidLicenseSpec`).

## When to Use vs. When Not to Use

| Situation | Recommendation |
|---|---|
| Complex, combinable domain rules | ✅ Specification Pattern |
| Simple one-off filter in a controller | ❌ Inline predicate |
| Repository needs dynamic Prisma `where` | ✅ Query-translatable spec |
| Performance-critical bulk DB queries | ⚠️ Translate to SQL, avoid in-memory |
| Cross-cutting validation (HTTP input) | ❌ Use Zod schemas instead |
| Domain invariant enforcement | ✅ Specification Pattern |

## Anti-Patterns to Avoid

- **Fat specs** — specs that read multiple unrelated fields belong to separate specs, composed with `.and()`.
- **Specs that cause side effects** — `isSatisfiedBy` must be a pure predicate.
- **Specs used for HTTP validation** — use Zod for request validation; specs are for domain objects.
- **God specification** — avoid one spec with 15 conditions; break into atomic pieces.

## Quick Reference — Composing Specs

```typescript
// AND
specA.and(specB)

// OR
specA.or(specB)

// NOT
specA.not()

// Chaining
specA.and(specB).or(specC.not())

// Applying to array
items.filter(item => mySpec.isSatisfiedBy(item))

// Applying to a single value
if (!mySpec.isSatisfiedBy(order)) throw new DomainError('Rule violated')
```

## Additional Resources

### Reference Files

For detailed patterns and advanced techniques, consult:

- **`references/patterns.md`** — Full catalog of specification variants: parameterized specs, query-translatable specs, async specs, and spec factories
- **`references/query-translation.md`** — How to translate specifications into Prisma `where` clauses and raw SQL predicates

### Example Files

Working TypeScript examples in `examples/`:

- **`examples/base-specification.ts`** — Complete base class + composite operators, ready to copy
- **`examples/warranty-domain.ts`** — Full warranty domain example with parameterized specs and repository integration
- **`examples/query-translatable.ts`** — Prisma query-translatable specification example
