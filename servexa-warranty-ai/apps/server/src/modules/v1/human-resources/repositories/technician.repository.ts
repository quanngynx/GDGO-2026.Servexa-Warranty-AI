import prisma from '@servexa-warranty-ai/db'
import type { Prisma } from '@servexa-warranty-ai/db/prisma/client'

import type { ITechnicianRepository } from '../interfaces/technician-repository.interface'

type TechnicianSelect = Prisma.TechnicianProfileSelect
type TechnicianInclude = Prisma.TechnicianProfileInclude
type TechnicianOptions<
  TSelect extends TechnicianSelect | undefined,
  TInclude extends TechnicianInclude | undefined,
> = {
  select?: TSelect
  include?: TInclude
}

export class TechnicianRepository implements ITechnicianRepository {
  async findAll(query: Prisma.TechnicianProfileFindManyArgs) {
    const { take, skip, where, orderBy, ...rest } = query
    return prisma.technicianProfile.findMany({
      take,
      skip,
      where,
      orderBy,
      ...rest,
    })
  }

  async count(where: Prisma.TechnicianProfileWhereInput) {
    return prisma.technicianProfile.count({ where })
  }

  async findOneById<TSelect extends TechnicianSelect | undefined, TInclude extends TechnicianInclude | undefined>(
    id: string,
    options?: TechnicianOptions<TSelect, TInclude>,
  ) {
    return prisma.technicianProfile.findUnique({
      where: { id },
      ...options,
    })
  }

  async findOneByUserId<
    TSelect extends TechnicianSelect | undefined,
    TInclude extends TechnicianInclude | undefined
  >(
    userId: string,
    options?: TechnicianOptions<TSelect, TInclude>,
  ) {
    return prisma.technicianProfile.findUnique({
      where: { userId },
      ...options,
    })
  }

  async createOne<TSelect extends TechnicianSelect | undefined, TInclude extends TechnicianInclude | undefined>(
    data: Prisma.TechnicianProfileCreateInput,
    options?: TechnicianOptions<TSelect, TInclude>,
  ) {
    return prisma.technicianProfile.create({
      data,
      ...options,
    })
  }

  async updateOneById<TSelect extends TechnicianSelect | undefined, TInclude extends TechnicianInclude | undefined>(
    id: string,
    data: Prisma.TechnicianProfileUpdateInput,
    options?: TechnicianOptions<TSelect, TInclude>,
  ) {
    return prisma.technicianProfile.update({
      where: { id },
      data,
      ...options,
    })
  }

  async deleteById(id: string) {
    return prisma.technicianProfile.delete({
      where: { id },
    })
  }
}
