// warranty-domain.ts
// Full warranty domain example: entities, specs, parameterized specs, factories,
// composite validator, in-memory repository. Ready to copy and adapt.

import { CompositeSpecification, CompositeValidator, ValidatableSpecification } from './base-specification'

// ─── Domain Entities ──────────────────────────────────────────────────────────

type CaseStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'CANCELLED'

interface RepairCase {
  readonly id: string
  readonly customerId: string
  readonly status: CaseStatus
  readonly warrantyExpiresAt: Date | null
  readonly totalCost: number
  readonly createdAt: Date
}

// ─── Atomic Specifications ────────────────────────────────────────────────────

class IsOpenCaseSpec extends CompositeSpecification<RepairCase> {
  isSatisfiedBy(c: RepairCase): boolean {
    return c.status === 'OPEN'
  }
}

class IsUnderWarrantySpec extends CompositeSpecification<RepairCase> {
  isSatisfiedBy(c: RepairCase): boolean {
    if (c.warrantyExpiresAt === null) return false
    return c.warrantyExpiresAt > new Date()
  }
}

class HasStatusSpec extends CompositeSpecification<RepairCase> {
  constructor(private readonly status: CaseStatus) { super() }

  isSatisfiedBy(c: RepairCase): boolean {
    return c.status === this.status
  }
}

class ForCustomerSpec extends CompositeSpecification<RepairCase> {
  constructor(private readonly customerId: string) { super() }

  isSatisfiedBy(c: RepairCase): boolean {
    return c.customerId === this.customerId
  }
}

class CreatedBetweenSpec extends CompositeSpecification<RepairCase> {
  constructor(
    private readonly from: Date,
    private readonly to: Date,
  ) { super() }

  isSatisfiedBy(c: RepairCase): boolean {
    return c.createdAt >= this.from && c.createdAt <= this.to
  }
}

class IsHighValueRepairSpec extends CompositeSpecification<RepairCase> {
  constructor(private readonly threshold: number = 5_000_000) { super() }

  isSatisfiedBy(c: RepairCase): boolean {
    return c.totalCost >= this.threshold
  }
}

// ─── Validatable Specifications ───────────────────────────────────────────────

class WarrantyNotExpiredSpec extends ValidatableSpecification<RepairCase> {
  get violationMessage(): string { return 'Warranty has expired' }

  isSatisfiedBy(c: RepairCase): boolean {
    if (c.warrantyExpiresAt === null) return false
    return c.warrantyExpiresAt > new Date()
  }
}

class CaseIsOpenSpec extends ValidatableSpecification<RepairCase> {
  get violationMessage(): string { return 'Repair case is not open' }

  isSatisfiedBy(c: RepairCase): boolean {
    return c.status === 'OPEN'
  }
}

// ─── Specification Factory (Domain Vocabulary) ────────────────────────────────

export const RepairCaseSpecs = {
  isOpen: () => new IsOpenCaseSpec(),
  isClosed: () => new IsOpenCaseSpec().not(),
  underWarranty: () => new IsUnderWarrantySpec(),
  outOfWarranty: () => new IsUnderWarrantySpec().not(),
  hasStatus: (status: CaseStatus) => new HasStatusSpec(status),
  forCustomer: (customerId: string) => new ForCustomerSpec(customerId),
  createdBetween: (from: Date, to: Date) => new CreatedBetweenSpec(from, to),
  isHighValue: (threshold?: number) => new IsHighValueRepairSpec(threshold),

  // Composed domain rules
  eligibleForAutoClose: () =>
    new IsUnderWarrantySpec().not().and(new IsOpenCaseSpec()),
  requiresManagerApproval: () =>
    new IsHighValueRepairSpec().and(new IsUnderWarrantySpec().not()),
} as const

// ─── In-Memory Repository ─────────────────────────────────────────────────────

import type { Specification } from './base-specification'

class InMemoryRepairCaseRepository {
  constructor(private readonly data: RepairCase[]) {}

  findSatisfying(spec: Specification<RepairCase>): RepairCase[] {
    return this.data.filter(c => spec.isSatisfiedBy(c))
  }

  countSatisfying(spec: Specification<RepairCase>): number {
    return this.data.filter(c => spec.isSatisfiedBy(c)).length
  }

  existsSatisfying(spec: Specification<RepairCase>): boolean {
    return this.data.some(c => spec.isSatisfiedBy(c))
  }
}

// ─── Domain Validator ─────────────────────────────────────────────────────────

class DomainValidationError extends Error {
  constructor(readonly violations: readonly string[]) {
    super(`Domain validation failed: ${violations.join(', ')}`)
    this.name = 'DomainValidationError'
  }
}

function validateRepairCase(repairCase: RepairCase): void {
  const validator = new CompositeValidator<RepairCase>()
    .add(new WarrantyNotExpiredSpec())
    .add(new CaseIsOpenSpec())

  const result = validator.validate(repairCase)
  if (!result.isValid) throw new DomainValidationError(result.violations)
}

// ─── Usage Examples ───────────────────────────────────────────────────────────

const cases: RepairCase[] = [
  {
    id: '1',
    customerId: 'cust-001',
    status: 'OPEN',
    warrantyExpiresAt: new Date(Date.now() + 86_400_000), // tomorrow
    totalCost: 1_000_000,
    createdAt: new Date(),
  },
  {
    id: '2',
    customerId: 'cust-001',
    status: 'OPEN',
    warrantyExpiresAt: new Date(Date.now() - 86_400_000), // yesterday — expired
    totalCost: 6_000_000,
    createdAt: new Date(),
  },
  {
    id: '3',
    customerId: 'cust-002',
    status: 'CLOSED',
    warrantyExpiresAt: null,
    totalCost: 2_000_000,
    createdAt: new Date(),
  },
]

const repo = new InMemoryRepairCaseRepository(cases)

// Find cases eligible for auto-close
const eligibleForAutoClose = repo.findSatisfying(
  RepairCaseSpecs.eligibleForAutoClose(),
)
// → [case #2] (open + out of warranty)

// Find high-value cases for manager approval for a specific customer
const needsApproval = repo.findSatisfying(
  RepairCaseSpecs.requiresManagerApproval().and(
    RepairCaseSpecs.forCustomer('cust-001'),
  ),
)
// → [case #2] (high-value + out-of-warranty + for cust-001)

// Validate a specific case
try {
  validateRepairCase(cases[1]!) // case #2 — expired warranty
} catch (e) {
  if (e instanceof DomainValidationError) {
    console.error(e.violations) // ['Warranty has expired']
  }
}

export {
  RepairCase,
  CaseStatus,
  IsOpenCaseSpec,
  IsUnderWarrantySpec,
  HasStatusSpec,
  ForCustomerSpec,
  CreatedBetweenSpec,
  IsHighValueRepairSpec,
  InMemoryRepairCaseRepository,
  validateRepairCase,
  DomainValidationError,
}
