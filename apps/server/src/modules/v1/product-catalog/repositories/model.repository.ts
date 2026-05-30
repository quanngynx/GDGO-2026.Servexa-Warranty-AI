import prisma from '@servexa-warranty-ai/db'
import type { Prisma } from '@servexa-warranty-ai/db/prisma/client'

import type { IModelRepository, ModelExportRow, ModelOptions } from '../interfaces/model-repository.interface'

type ModelSelect = Prisma.ModelSelect
type ModelInclude = Prisma.ModelInclude

const exportSelect = {
  id: true,
  modelCode: true,
  name: true,
  categoryId: true,
  status: true,
  laborCost: true,
  inspectionCost: true,
  stockNumber: true,
  image: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ModelSelect

export class ModelRepository implements IModelRepository {
  async findAll(query: Prisma.ModelFindManyArgs) {
    const { take, skip, where, orderBy, ...rest } = query
    return prisma.model.findMany({
      take,
      skip,
      where,
      orderBy,
      ...rest,
    })
  }

  async count(where: Prisma.ModelWhereInput) {
    return prisma.model.count({ where })
  }

  async findOneById<TSelect extends ModelSelect | undefined, TInclude extends ModelInclude | undefined>(
    id: string,
    options?: ModelOptions<TSelect, TInclude>,
  ) {
    return prisma.model.findUnique({
      where: { id },
      ...options,
    })
  }

  async findOneByModelCode<TSelect extends ModelSelect | undefined, TInclude extends ModelInclude | undefined>(
    modelCode: string,
    options?: ModelOptions<TSelect, TInclude>,
  ) {
    return prisma.model.findUnique({
      where: { modelCode },
      ...options,
    })
  }

  async createOne<TSelect extends ModelSelect | undefined, TInclude extends ModelInclude | undefined>(
    data: Prisma.ModelCreateInput,
    options?: ModelOptions<TSelect, TInclude>,
  ) {
    return prisma.model.create({
      data,
      ...options,
    })
  }

  async updateOneById<TSelect extends ModelSelect | undefined, TInclude extends ModelInclude | undefined>(
    id: string,
    data: Prisma.ModelUpdateInput,
    options?: ModelOptions<TSelect, TInclude>,
  ) {
    return prisma.model.update({
      where: { id },
      data,
      ...options,
    })
  }

  async softDeleteById(id: string) {
    return prisma.model.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }

  async restoreById(id: string) {
    return prisma.model.update({
      where: { id },
      data: { deletedAt: null },
    })
  }

  async findManyForExport(): Promise<ModelExportRow[]> {
    return prisma.model.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: exportSelect,
    })
  }
}
