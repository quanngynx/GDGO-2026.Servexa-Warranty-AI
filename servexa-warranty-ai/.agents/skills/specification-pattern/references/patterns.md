# Specification Pattern — Detailed Patterns Reference

## 1. Base Infrastructure (copy-paste ready)

```typescript
// specification.ts
export interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean
  and(other: Specification<T>): Specification<T>
  or(other: Specification<T>): Specification<T>
  not(): Specification<T>
}

export abstract class CompositeSpecification<T> implements Specification<T> {
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

---

## 2. Parameterized Specifications

Parameterized specs accept constructor arguments to make the rule configurable without creating multiple spec classes.

```typescript
// Parameterized — user role check
class HasRoleSpec extends CompositeSpecification<User> {
  constructor(private readonly role: UserRole) { super() }

  isSatisfiedBy(user: User): boolean {
    return user.roles.includes(this.role)
  }
}

// Usage
const isAdmin = new HasRoleSpec('ADMIN')
const isTechnician = new HasRoleSpec('TECHNICIAN')
const isAdminOrTech = isAdmin.or(isTechnician)
```

```typescript
// Parameterized — date range check
class CreatedWithinSpec extends CompositeSpecification<RepairCase> {
  constructor(
    private readonly from: Date,
    private readonly to: Date,
  ) { super() }

  isSatisfiedBy(c: RepairCase): boolean {
    return c.createdAt >= this.from && c.createdAt <= this.to
  }
}
```

---

## 3. Spec Factory Functions

Use factory functions to keep call sites readable and hide construction details.

```typescript
// specification-factories.ts
export const Specs = {
  isOpen: () => new IsOpenCaseSpec(),
  underWarranty: () => new IsUnderWarrantySpec(),
  createdBetween: (from: Date, to: Date) => new CreatedWithinSpec(from, to),
  hasStatus: (status: CaseStatus) => new HasStatusSpec(status),
  forCustomer: (customerId: string) => new ForCustomerSpec(customerId),
} as const

// Usage at service layer — reads like plain English
const spec = Specs.isOpen()
  .and(Specs.underWarranty())
  .and(Specs.createdBetween(startOfMonth, endOfMonth))
```

---

## 4. Async Specifications

When a rule requires an I/O lookup (e.g., checking DB for active subscription), use an async variant.

```typescript
export interface AsyncSpecification<T> {
  isSatisfiedBy(candidate: T): Promise<boolean>
  and(other: AsyncSpecification<T>): AsyncSpecification<T>
  or(other: AsyncSpecification<T>): AsyncSpecification<T>
  not(): AsyncSpecification<T>
}

export abstract class AsyncCompositeSpecification<T> implements AsyncSpecification<T> {
  abstract isSatisfiedBy(candidate: T): Promise<boolean>

  and(other: AsyncSpecification<T>): AsyncSpecification<T> {
    return new AsyncAndSpecification(this, other)
  }

  or(other: AsyncSpecification<T>): AsyncSpecification<T> {
    return new AsyncOrSpecification(this, other)
  }

  not(): AsyncSpecification<T> {
    return new AsyncNotSpecification(this)
  }
}

class AsyncAndSpecification<T> extends AsyncCompositeSpecification<T> {
  constructor(
    private readonly left: AsyncSpecification<T>,
    private readonly right: AsyncSpecification<T>,
  ) { super() }

  async isSatisfiedBy(candidate: T): Promise<boolean> {
    const [l, r] = await Promise.all([
      this.left.isSatisfiedBy(candidate),
      this.right.isSatisfiedBy(candidate),
    ])
    return l && r
  }
}

// Concrete async spec
class HasActiveSubscriptionSpec extends AsyncCompositeSpecification<User> {
  constructor(private readonly subscriptionRepo: SubscriptionRepository) { super() }

  async isSatisfiedBy(user: User): Promise<boolean> {
    const sub = await this.subscriptionRepo.findActiveByUserId(user.id)
    return sub !== null
  }
}
```

> **Note:** Prefer synchronous specs where possible. Only use async specs when the rule genuinely requires I/O.

---

## 5. Validation Specifications (with error messages)

Extend specs to collect human-readable violation messages for domain invariant checking.

```typescript
export interface ValidationSpecification<T> extends Specification<T> {
  isSatisfiedBy(candidate: T): boolean
  validate(candidate: T): ValidationResult
}

export interface ValidationResult {
  isValid: boolean
  violations: string[]
}

export abstract class ValidatableSpecification<T> extends CompositeSpecification<T>
  implements ValidationSpecification<T> {

  abstract get violationMessage(): string

  validate(candidate: T): ValidationResult {
    const isValid = this.isSatisfiedBy(candidate)
    return {
      isValid,
      violations: isValid ? [] : [this.violationMessage],
    }
  }
}

// Composite validator that collects all violations
export class CompositeValidator<T> {
  private readonly specs: ValidationSpecification<T>[] = []

  add(spec: ValidationSpecification<T>): this {
    this.specs.push(spec)
    return this
  }

  validate(candidate: T): ValidationResult {
    const violations = this.specs
      .map(s => s.validate(candidate))
      .flatMap(r => r.violations)
    return { isValid: violations.length === 0, violations }
  }
}

// Usage
class WarrantyNotExpiredSpec extends ValidatableSpecification<RepairCase> {
  get violationMessage(): string { return 'Warranty has expired' }

  isSatisfiedBy(c: RepairCase): boolean {
    return c.warrantyExpiresAt > new Date()
  }
}

const validator = new CompositeValidator<RepairCase>()
  .add(new WarrantyNotExpiredSpec())
  .add(new CaseIsOpenSpec())

const result = validator.validate(repairCase)
if (!result.isValid) throw new DomainValidationError(result.violations)
```

---

## 6. Specification + Repository Pattern

Pass specs into repository methods to keep query logic in one place.

```typescript
// Repository interface
interface RepairCaseRepository {
  findSatisfying(spec: Specification<RepairCase>): Promise<RepairCase[]>
  countSatisfying(spec: Specification<RepairCase>): Promise<number>
  existsSatisfying(spec: Specification<RepairCase>): Promise<boolean>
}

// In-memory implementation (useful for tests)
class InMemoryRepairCaseRepository implements RepairCaseRepository {
  constructor(private readonly data: RepairCase[]) {}

  async findSatisfying(spec: Specification<RepairCase>): Promise<RepairCase[]> {
    return this.data.filter(c => spec.isSatisfiedBy(c))
  }

  async countSatisfying(spec: Specification<RepairCase>): Promise<number> {
    return this.data.filter(c => spec.isSatisfiedBy(c)).length
  }

  async existsSatisfying(spec: Specification<RepairCase>): Promise<boolean> {
    return this.data.some(c => spec.isSatisfiedBy(c))
  }
}
```

---

## 7. Named Specification Sets (Domain Vocabulary)

Group related specifications as a namespace to express domain vocabulary clearly.

```typescript
// repair-case.specs.ts
export namespace RepairCaseSpecs {
  export const isOpen = (): Specification<RepairCase> => new IsOpenCaseSpec()
  export const isClosed = (): Specification<RepairCase> => isOpen().not()
  export const underWarranty = (): Specification<RepairCase> => new IsUnderWarrantySpec()
  export const outOfWarranty = (): Specification<RepairCase> => underWarranty().not()
  export const eligibleForAutoClose = (): Specification<RepairCase> =>
    outOfWarranty().and(isOpen())
  export const requiresManagerApproval = (): Specification<RepairCase> =>
    new HighValueRepairSpec().and(outOfWarranty())
}

// Usage reads like domain language
const eligible = cases.filter(c =>
  RepairCaseSpecs.eligibleForAutoClose().isSatisfiedBy(c)
)
```

---

## 8. Testing Specifications

Specifications are easy to unit test in isolation.

```typescript
// warranty-spec.test.ts
describe('IsUnderWarrantySpec', () => {
  const spec = new IsUnderWarrantySpec()

  it('satisfies when warranty has not expired', () => {
    const future = new Date(Date.now() + 1_000_000)
    expect(spec.isSatisfiedBy({ warrantyExpiresAt: future } as RepairCase)).toBe(true)
  })

  it('does not satisfy when warranty is expired', () => {
    const past = new Date(Date.now() - 1_000_000)
    expect(spec.isSatisfiedBy({ warrantyExpiresAt: past } as RepairCase)).toBe(false)
  })
})

describe('Composition', () => {
  it('AND returns false when one spec fails', () => {
    const always = { isSatisfiedBy: () => true } as Specification<unknown>
    const never = { isSatisfiedBy: () => false } as Specification<unknown>
    const composed = new AndSpecification(always, never)
    expect(composed.isSatisfiedBy({})).toBe(false)
  })
})
```
