import { Prisma } from '@/core/infra/prisma/generated/client';

export class ExtractPagination {
  buildSortOrder = <T>(sortBy?: string, sortOrder?: string): T => {
    if (!sortBy) return { createdAt: 'desc' } as T;

    return {
      [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc',
    } as T;
  };

  buildSearchQuery = (search?: string) => {
    if (!search) return {};

    return {
      OR: [
        { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
        {
          description: { contains: search, mode: Prisma.QueryMode.insensitive },
        },
      ],
    };
  };
}
