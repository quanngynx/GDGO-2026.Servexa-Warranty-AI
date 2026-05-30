import type { BasePagination } from '@/types/pagination'

export const buildPagination = (page: number, limit: number, total: number): BasePagination => {
  const totalPages = Math.max(1, Math.ceil(total / limit))

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}
