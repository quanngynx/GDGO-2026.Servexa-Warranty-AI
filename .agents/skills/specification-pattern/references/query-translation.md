# Specification Pattern — Prisma Query Translation

## Overview

Query-translatable specifications extend the base specification to also produce a Prisma `where` clause. This lets the same spec drive both in-memory filtering (for unit tests) and database queries (for production).

## Interface Extension

```typescript
import { Prisma } from '@prisma/client'

// Extend base spec with a Prisma where clause builder
export interface PrismaSpecification<T, W> extends Specification<T> {
  toWhere(): W
}
```

## Generic Translatable Base

```typescript
export abstract class PrismaCompositeSpecification<T, W>
  extends CompositeSpecification<T>
  implements PrismaSpecification<T, W> {

  abstract toWhere(): W

  // Override composite operators to produce query-aware composites
  andQuery(other: PrismaCompositeSpecification<T, W>): PrismaCompositeSpecification<T, W> {
    return new PrismaAndSpecification(this, other)
  }

  orQuery(other: PrismaCompositeSpecification<T, W>): PrismaCompositeSpecification<T, W> {
    return new PrismaOrSpecification(this, other)
  }

  notQuery(): PrismaCompositeSpecification<T, W> {
    return new PrismaNotSpecification(this)
  }
}
```

## Prisma Composite Operators

```typescript
type RepairCaseWhere = Prisma.RepairCaseWhereInput

class PrismaAndSpecification<T> extends PrismaCompositeSpecification<T, RepairCaseWhere> {
  constructor(
    private readonly left: PrismaCompositeSpecification<T, RepairCaseWhere>,
    private readonly right: PrismaCompositeSpecification<T, RepairCaseWhere>,
  ) { super() }

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) && this.right.isSatisfiedBy(candidate)
  }

  toWhere(): RepairCaseWhere {
    return { AND: [this.left.toWhere(), this.right.toWhere()] }
  }
}

class PrismaOrSpecification<T> extends PrismaCompositeSpecification<T, RepairCaseWhere> {
  constructor(
    private readonly left: PrismaCompositeSpecification<T, RepairCaseWhere>,
    private readonly right: PrismaCompositeSpecification<T, RepairCaseWhere>,
  ) { super() }

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) || this.right.isSatisfiedBy(candidate)
  }

  toWhere(): RepairCaseWhere {
    return { OR: [this.left.toWhere(), this.right.toWhere()] }
  }
}

class PrismaNotSpecification<T> extends PrismaCompositeSpecification<T, RepairCaseWhere> {
  constructor(private readonly spec: PrismaCompositeSpecification<T, RepairCaseWhere>) { super() }

  isSatisfiedBy(candidate: T): boolean {
    return !this.spec.isSatisfiedBy(candidate)
  }

  toWhere(): RepairCaseWhere {
    return { NOT: this.spec.toWhere() }
  }
}
```

## Concrete Query-Translatable Specs

```typescript
// repair-case-prisma-specs.ts
import type { RepairCase } from '@prisma/client'

type RepairCaseWhere = Prisma.RepairCaseWhereInput

class IsOpenCasePrismaSpec extends PrismaCompositeSpecification<RepairCase, RepairCaseWhere> {
  isSatisfiedBy(c: RepairCase): boolean {
    return c.status === 'OPEN'
  }

  toWhere(): RepairCaseWhere {
    return { status: 'OPEN' }
  }
}

class IsUnderWarrantyPrismaSpec extends PrismaCompositeSpecification<RepairCase, RepairCaseWhere> {
  isSatisfiedBy(c: RepairCase): boolean {
    return c.warrantyExpiresAt !== null && c.warrantyExpiresAt > new Date()
  }

  toWhere(): RepairCaseWhere {
    return { warrantyExpiresAt: { gt: new Date() } }
  }
}

class ForCustomerPrismaSpec extends PrismaCompositeSpecification<RepairCase, RepairCaseWhere> {
  constructor(private readonly customerId: string) { super() }

  isSatisfiedBy(c: RepairCase): boolean {
    return c.customerId === this.customerId
  }

  toWhere(): RepairCaseWhere {
    return { customerId: this.customerId }
  }
}
```

## Prisma Repository Integration

```typescript
// repair-case.repository.ts
export class PrismaRepairCaseRepository {
  constructor(private readonly db: PrismaClient) {}

  async findSatisfying(
    spec: PrismaCompositeSpecification<RepairCase, RepairCaseWhere>,
  ): Promise<RepairCase[]> {
    return this.db.repairCase.findMany({
      where: spec.toWhere(),
    })
  }

  async countSatisfying(
    spec: PrismaCompositeSpecification<RepairCase, RepairCaseWhere>,
  ): Promise<number> {
    return this.db.repairCase.count({
      where: spec.toWhere(),
    })
  }

  async paginate(
    spec: PrismaCompositeSpecification<RepairCase, RepairCaseWhere>,
    page: number,
    pageSize: number,
  ): Promise<{ data: RepairCase[]; total: number }> {
    const [data, total] = await this.db.$transaction([
      this.db.repairCase.findMany({
        where: spec.toWhere(),
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.db.repairCase.count({ where: spec.toWhere() }),
    ])
    return { data, total }
  }
}
```

## Usage in Service Layer

```typescript
// repair-case.service.ts
export class RepairCaseService {
  constructor(private readonly repo: PrismaRepairCaseRepository) {}

  async getEligibleForAutoClose(customerId: string): Promise<RepairCase[]> {
    const spec = new IsOpenCasePrismaSpec()
      .andQuery(new IsUnderWarrantyPrismaSpec().notQuery())
      .andQuery(new ForCustomerPrismaSpec(customerId))

    // Generates: WHERE status = 'OPEN' AND NOT (warrantyExpiresAt > NOW()) AND customerId = '...'
    return this.repo.findSatisfying(spec)
  }
}
```

## API Filter → Spec Mapping

Map HTTP query parameters to specs for dynamic filtering endpoints.

```typescript
// filter-spec-builder.ts
interface RepairCaseFilters {
  status?: CaseStatus
  customerId?: string
  underWarranty?: boolean
  createdFrom?: string
  createdTo?: string
}

function buildFilterSpec(
  filters: RepairCaseFilters,
): PrismaCompositeSpecification<RepairCase, RepairCaseWhere> | null {
  const specs: Array<PrismaCompositeSpecification<RepairCase, RepairCaseWhere>> = []

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

  if (specs.length === 0) return null

  return specs.reduce((acc, spec) => acc.andQuery(spec))
}

// In controller / route handler
async function listRepairCases(req: Request, res: Response) {
  const filters = parseFilters(req.query)
  const spec = buildFilterSpec(filters)

  const results = spec
    ? await service.findSatisfying(spec)
    : await service.findAll()

  return res.json(results)
}
```

## Performance Considerations

- **Always translate to DB queries** for large datasets — never load all rows and filter in-memory.
- **Index fields** used in specs: `status`, `customerId`, `warrantyExpiresAt`.
- **Combine with `orderBy` and `take`** in the repository, not inside the spec.
- **Avoid N+1**: specs should not trigger additional queries inside `isSatisfiedBy` — use async specs for that pattern and batch-load data before filtering.
- **Cache composed `toWhere()` output** when the same spec is used in multiple repository calls within one request.
