// query-translatable.ts
// Prisma query-translatable specification example.
// Each spec implements both `isSatisfiedBy` (in-memory) and `toWhere` (Prisma DB query).
// This allows the same spec to drive unit tests AND production database queries.
//
// Note: Replace `Prisma.RepairCaseWhereInput` with your actual generated Prisma type.

import { CompositeSpecification } from './base-specification'

// ─── Fake Prisma types for self-contained example ────────────────────────────
// In a real project, import from '@prisma/client':
//   import type { Prisma, RepairCase } from '@prisma/client'

type CaseStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'CANCELLED'

interface RepairCase {
  readonly id: string
  readonly customerId: string
  readonly status: CaseStatus
  readonly warrantyExpiresAt: Date | null
  readonly totalCost: number
  readonly createdAt: Date
}

// Simplified Prisma where input type (mirroring real Prisma output)
type RepairCaseWhere = {
  AND?: RepairCaseWhere | RepairCaseWhere[]
  OR?: RepairCaseWhere[]
  NOT?: RepairCaseWhere
  status?: CaseStatus | { in: CaseStatus[] }
  customerId?: string
  warrantyExpiresAt?: { gt?: Date; lt?: Date; equals?: Date | null } | null
  totalCost?: { gte?: number; lte?: number }
  createdAt?: { gte?: Date; lte?: Date }
}

// ─── Query-Translatable Base ──────────────────────────────────────────────────

abstract class PrismaSpec extends CompositeSpecification<RepairCase> {
  abstract toWhere(): RepairCaseWhere

  andQuery(other: PrismaSpec): PrismaSpec {
    return new PrismaAndSpec(this, other)
  }

  orQuery(other: PrismaSpec): PrismaSpec {
    return new PrismaOrSpec(this, other)
  }

  notQuery(): PrismaSpec {
    return new PrismaNotSpec(this)
  }
}

// ─── Composite Query Operators ────────────────────────────────────────────────

class PrismaAndSpec extends PrismaSpec {
  constructor(
    private readonly left: PrismaSpec,
    private readonly right: PrismaSpec,
  ) { super() }

  isSatisfiedBy(c: RepairCase): boolean {
    return this.left.isSatisfiedBy(c) && this.right.isSatisfiedBy(c)
  }

  toWhere(): RepairCaseWhere {
    return { AND: [this.left.toWhere(), this.right.toWhere()] }
  }
}

class PrismaOrSpec extends PrismaSpec {
  constructor(
    private readonly left: PrismaSpec,
    private readonly right: PrismaSpec,
  ) { super() }

  isSatisfiedBy(c: RepairCase): boolean {
    return this.left.isSatisfiedBy(c) || this.right.isSatisfiedBy(c)
  }

  toWhere(): RepairCaseWhere {
    return { OR: [this.left.toWhere(), this.right.toWhere()] }
  }
}

class PrismaNotSpec extends PrismaSpec {
  constructor(private readonly spec: PrismaSpec) { super() }

  isSatisfiedBy(c: RepairCase): boolean {
    return !this.spec.isSatisfiedBy(c)
  }

  toWhere(): RepairCaseWhere {
    return { NOT: this.spec.toWhere() }
  }
}

// ─── Concrete Query-Translatable Specs ───────────────────────────────────────

class IsOpenCasePrismaSpec extends PrismaSpec {
  isSatisfiedBy(c: RepairCase): boolean { return c.status === 'OPEN' }
  toWhere(): RepairCaseWhere { return { status: 'OPEN' } }
}

class IsUnderWarrantyPrismaSpec extends PrismaSpec {
  isSatisfiedBy(c: RepairCase): boolean {
    return c.warrantyExpiresAt !== null && c.warrantyExpiresAt > new Date()
  }
  toWhere(): RepairCaseWhere { return { warrantyExpiresAt: { gt: new Date() } } }
}

class ForCustomerPrismaSpec extends PrismaSpec {
  constructor(private readonly customerId: string) { super() }

  isSatisfiedBy(c: RepairCase): boolean { return c.customerId === this.customerId }
  toWhere(): RepairCaseWhere { return { customerId: this.customerId } }
}

class HasStatusPrismaSpec extends PrismaSpec {
  constructor(private readonly status: CaseStatus) { super() }

  isSatisfiedBy(c: RepairCase): boolean { return c.status === this.status }
  toWhere(): RepairCaseWhere { return { status: this.status } }
}

class CreatedBetweenPrismaSpec extends PrismaSpec {
  constructor(
    private readonly from: Date,
    private readonly to: Date,
  ) { super() }

  isSatisfiedBy(c: RepairCase): boolean {
    return c.createdAt >= this.from && c.createdAt <= this.to
  }

  toWhere(): RepairCaseWhere {
    return { createdAt: { gte: this.from, lte: this.to } }
  }
}

class IsHighValuePrismaSpec extends PrismaSpec {
  constructor(private readonly threshold: number = 5_000_000) { super() }

  isSatisfiedBy(c: RepairCase): boolean { return c.totalCost >= this.threshold }
  toWhere(): RepairCaseWhere { return { totalCost: { gte: this.threshold } } }
}

// ─── Prisma Repository Integration ───────────────────────────────────────────

// Simulated PrismaClient for the example
interface PrismaRepairCaseDelegate {
  findMany(args: { where?: RepairCaseWhere; skip?: number; take?: number }): Promise<RepairCase[]>
  count(args: { where?: RepairCaseWhere }): Promise<number>
}

class RepairCaseRepository {
  constructor(private readonly db: { repairCase: PrismaRepairCaseDelegate }) {}

  async findSatisfying(spec: PrismaSpec): Promise<RepairCase[]> {
    return this.db.repairCase.findMany({ where: spec.toWhere() })
  }

  async countSatisfying(spec: PrismaSpec): Promise<number> {
    return this.db.repairCase.count({ where: spec.toWhere() })
  }

  async paginate(
    spec: PrismaSpec,
    page: number,
    pageSize: number,
  ): Promise<{ data: RepairCase[]; total: number }> {
    const [data, total] = await Promise.all([
      this.db.repairCase.findMany({
        where: spec.toWhere(),
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.db.repairCase.count({ where: spec.toWhere() }),
    ])
    return { data, total }
  }
}

// ─── Service Layer Usage ──────────────────────────────────────────────────────

class RepairCaseService {
  constructor(private readonly repo: RepairCaseRepository) {}

  async getEligibleForAutoClose(customerId: string): Promise<RepairCase[]> {
    // Generates WHERE: NOT(warrantyExpiresAt > NOW()) AND status = 'OPEN' AND customerId = '...'
    const spec = new IsUnderWarrantyPrismaSpec()
      .notQuery()
      .andQuery(new IsOpenCasePrismaSpec())
      .andQuery(new ForCustomerPrismaSpec(customerId))

    return this.repo.findSatisfying(spec)
  }

  async getHighValueOutOfWarrantyCases(): Promise<RepairCase[]> {
    const spec = new IsHighValuePrismaSpec()
      .andQuery(new IsUnderWarrantyPrismaSpec().notQuery())

    return this.repo.findSatisfying(spec)
  }
}

// ─── HTTP Filter → Spec Mapping ───────────────────────────────────────────────

interface RepairCaseFilters {
  status?: CaseStatus
  customerId?: string
  underWarranty?: boolean
  createdFrom?: string
  createdTo?: string
  minCost?: number
}

function buildFilterSpec(filters: RepairCaseFilters): PrismaSpec | null {
  const specs: PrismaSpec[] = []

  if (filters.status) specs.push(new HasStatusPrismaSpec(filters.status))
  if (filters.customerId) specs.push(new ForCustomerPrismaSpec(filters.customerId))
  if (filters.underWarranty === true) specs.push(new IsUnderWarrantyPrismaSpec())
  if (filters.underWarranty === false) specs.push(new IsUnderWarrantyPrismaSpec().notQuery())
  if (filters.createdFrom && filters.createdTo) {
    specs.push(new CreatedBetweenPrismaSpec(
      new Date(filters.createdFrom),
      new Date(filters.createdTo),
    ))
  }
  if (filters.minCost !== undefined) specs.push(new IsHighValuePrismaSpec(filters.minCost))

  if (specs.length === 0) return null
  return specs.reduce((acc, spec) => acc.andQuery(spec))
}

export {
  PrismaSpec,
  IsOpenCasePrismaSpec,
  IsUnderWarrantyPrismaSpec,
  ForCustomerPrismaSpec,
  HasStatusPrismaSpec,
  CreatedBetweenPrismaSpec,
  IsHighValuePrismaSpec,
  RepairCaseRepository,
  RepairCaseService,
  buildFilterSpec,
  RepairCaseWhere,
  RepairCaseFilters,
}
