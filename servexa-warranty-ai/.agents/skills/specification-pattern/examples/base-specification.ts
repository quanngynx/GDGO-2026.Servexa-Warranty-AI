// base-specification.ts
// Complete, copy-paste-ready base infrastructure for the Specification Pattern in TypeScript.
// All classes follow strict mode — no `any`, readonly fields, single-responsibility.

// ─── Core Interface ───────────────────────────────────────────────────────────

export interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean
  and(other: Specification<T>): Specification<T>
  or(other: Specification<T>): Specification<T>
  not(): Specification<T>
}

// ─── Abstract Base ────────────────────────────────────────────────────────────

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

// ─── Composite Operators ──────────────────────────────────────────────────────

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

// ─── Async Variant ────────────────────────────────────────────────────────────

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

class AsyncOrSpecification<T> extends AsyncCompositeSpecification<T> {
  constructor(
    private readonly left: AsyncSpecification<T>,
    private readonly right: AsyncSpecification<T>,
  ) { super() }

  async isSatisfiedBy(candidate: T): Promise<boolean> {
    const [l, r] = await Promise.all([
      this.left.isSatisfiedBy(candidate),
      this.right.isSatisfiedBy(candidate),
    ])
    return l || r
  }
}

class AsyncNotSpecification<T> extends AsyncCompositeSpecification<T> {
  constructor(private readonly spec: AsyncSpecification<T>) { super() }

  async isSatisfiedBy(candidate: T): Promise<boolean> {
    return !(await this.spec.isSatisfiedBy(candidate))
  }
}

// ─── Validation Variant ───────────────────────────────────────────────────────

export interface ValidationResult {
  readonly isValid: boolean
  readonly violations: readonly string[]
}

export abstract class ValidatableSpecification<T> extends CompositeSpecification<T> {
  abstract get violationMessage(): string

  validate(candidate: T): ValidationResult {
    const isValid = this.isSatisfiedBy(candidate)
    return { isValid, violations: isValid ? [] : [this.violationMessage] }
  }
}

export class CompositeValidator<T> {
  private readonly specs: ValidatableSpecification<T>[] = []

  add(spec: ValidatableSpecification<T>): this {
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
