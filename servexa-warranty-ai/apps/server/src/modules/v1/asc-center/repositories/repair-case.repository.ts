import prisma from '@servexa-warranty-ai/db'
import { Prisma } from '@servexa-warranty-ai/db/prisma/client'
import type { IRepairCaseRepository } from '../interfaces/repair-case-repository.interface'
import type {
  FindAllRepairCasesInput,
  ExportRepairCasesInput,
  CreateRepairCaseInput,
  ReplaceRepairCaseInput,
  UpdateRepairCaseInput,
} from '../dtos/repair-case.dto'

export const repairCaseListSelect = {
  id: true,
  caseNumber: true,
  ascCenterId: true,
  customerId: true,
  status: true,
  priority: true,
  serialNumber: true,
  receivedDate: true,
  createdAt: true,
  ascCenter: { select: { centerName: true, centerCode: true } },
  customer: { select: { fullName: true, phone1: true } },
  model: { select: { name: true, modelCode: true } },
} satisfies Prisma.RepairCaseSelect

export const repairCaseDetailSelect = {
  ...repairCaseListSelect,
  warrantyForm: true,
  warrantyServiceType: true,
  solutionId: true,
  damageDescription: true,
  diagnosis: true,
  exchangeProduct: true,
  invoiceCode: true,
  repairSolution: true,
  repairNotes: true,
  totalCost: true,
  laborCost: true,
  partsCost: true,
  serviceFee: true,
  shippingCost: true,
  shippingProvinceId: true,
  shippingWardId: true,
  discountAmount: true,
  otherFee: true,
  otherFeeNote: true,
  estimatedCompletionDate: true,
  promisedDeliveryDate: true,
  actualCompletionDate: true,
  paymentDate: true,
  paymentMethod: true,
  paymentReference: true,
  paymentNotes: true,
  deliveryNotes: true,
  ascPaymentAmount: true,
  companyDeduction: true,
  taxAmount: true,
  processingFee: true,
  netPayment: true,
  finalCompletionDate: true,
  assignedEmployeeId: true,
  assignedTechnicianId: true,
  technicianName: true,
  createdBy: true,
  approvedBy: true,
  receiverName: true,
  receiverPhone: true,
  householdProductType: true,
  foodSafetyCompliance: true,
  sealIntegrityStatus: true,
  plasticDurabilityLevel: true,
  estimatedStartDate: true,
  estimatedCost: true,
  actualRepairTime: true,
  estimatedRepairTime: true,
  resolution: true,
  updatedAt: true,
  distanceFee: true,
  distanceFeeCalculatedAt: true,
  distanceFeeCalculatedBy: true,
  serviceDistance: true,
  errorSource: true,
  errorGroup: true,
  repairLevel: true,
  warrantyResolution: true,
  repairActivity: true,
  statusRecall: true,
  solution: true,
  _count: {
    select: {
      accessories: true,
      images: true,
      statusHistory: true,
      fieldHistory: true,
      accessoryRequest: true,
    },
  },
} satisfies Prisma.RepairCaseSelect

export class RepairCaseRepository implements IRepairCaseRepository {
  private buildRepairCasesWhere(input: FindAllRepairCasesInput): Prisma.RepairCaseWhereInput {
    return {
      ...(input.ascCenterId ? { ascCenterId: input.ascCenterId } : {}),
      ...(input.customerId ? { customerId: input.customerId } : {}),
      ...(input.status ? { status: input.status } : {}),
      ...(input.serialNumber ? { serialNumber: { contains: input.serialNumber, mode: 'insensitive' } } : {}),
      ...(input.dateFrom || input.dateTo
        ? {
            receivedDate: {
              ...(input.dateFrom ? { gte: input.dateFrom } : {}),
              ...(input.dateTo ? { lte: input.dateTo } : {}),
            },
          }
        : {}),
      ...(input.search
        ? {
            OR: [
              { caseNumber: { contains: input.search, mode: 'insensitive' } },
              { serialNumber: { contains: input.search, mode: 'insensitive' } },
              { damageDescription: { contains: input.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    }
  }

  async findMany(input: FindAllRepairCasesInput) {
    const skip = ((input.page || 1) - 1) * (input.limit || 10)
    return prisma.repairCase.findMany({
      where: this.buildRepairCasesWhere(input),
      select: repairCaseListSelect,
      orderBy: { [input.sortBy || 'createdAt']: input.sortOrder || 'desc' },
      skip,
      take: input.limit || 10,
    }) as any
  }

  async count(input: FindAllRepairCasesInput) {
    return prisma.repairCase.count({
      where: this.buildRepairCasesWhere(input),
    })
  }

  async findOneById(id: string) {
    return prisma.repairCase.findUnique({
      where: { id },
      select: repairCaseDetailSelect,
    }) as any
  }

  async findStatusHistory(id: string) {
    return prisma.repairCaseStatusHistory.findMany({
      where: { repairCaseId: id },
      orderBy: { changedAt: 'desc' },
      include: { changedByUser: { select: { fullName: true } } },
    })
  }

  async findFieldHistory(id: string) {
    return prisma.repairCaseFieldHistory.findMany({
      where: { repairCaseId: id },
      orderBy: { changedAt: 'desc' },
      include: { changedByUser: { select: { fullName: true } } },
    })
  }

  async findAccessoryRequests(id: string) {
    return prisma.accessoryRequest.findMany({
      where: { repairCaseId: id },
      orderBy: { requestDate: 'desc' },
    })
  }

  async findImages(id: string) {
    return prisma.repairCaseImage.findMany({
      where: { repairCaseId: id },
      orderBy: { uploadedAt: 'desc' },
      include: { uploader: { select: { fullName: true } } },
    }) as any
  }

  async findImageById(id: string, imageId: string) {
    return prisma.repairCaseImage.findUnique({
      where: { id: imageId, repairCaseId: id },
      include: { uploader: { select: { fullName: true } } },
    }) as any
  }

  async findAccessoryRowById(id: string, accessoryRowId: string) {
    return prisma.repairCaseAccessory.findUnique({
      where: { id: accessoryRowId, repairCaseId: id },
      include: {
        accessory: { select: { partNumber: true, name: true } },
        addedByUser: { select: { fullName: true } },
      },
    }) as any
  }

  async findManyForExport(
    kind: 'fixing' | 'waiting_parts' | 'exchange_in_progress' | 'repeated_huyphieu',
    filter: ExportRepairCasesInput,
  ) {
    let where: Prisma.RepairCaseWhereInput = {
      ...(filter.ascCenterId ? { ascCenterId: filter.ascCenterId } : {}),
    }

    if (kind === 'fixing') {
      where.status = 'dangsua'
    } else if (kind === 'waiting_parts') {
      where.status = 'chocaplk'
    } else if (kind === 'exchange_in_progress') {
      where.status = { notIn: ['hoanthanh', 'dagiao', 'huyphieu', 'exchange_completed_asc'] }
      where.OR = [
        { warrantyResolution: { contains: 'exchange', mode: 'insensitive' } },
        { solution: { is: { name: { contains: 'exchange', mode: 'insensitive' } } } },
      ]
    } else if (kind === 'repeated_huyphieu') {
      const serials = await this.findRepeatedHuyphieuSerials()
      if (serials.length === 0) return []
      where.status = 'huyphieu'
      where.serialNumber = { in: serials }
    }

    return prisma.repairCase.findMany({
      where,
      select: repairCaseDetailSelect,
      orderBy: { receivedDate: 'desc' },
    }) as any
  }

  async findRepeatedHuyphieuSerials() {
    const groups = await prisma.repairCase.groupBy({
      by: ['serialNumber'],
      where: { status: 'huyphieu', serialNumber: { not: null } },
      having: {
        serialNumber: { _count: { gt: 1 } },
      },
    })
    return groups.map((g) => g.serialNumber as string)
  }

  async generateCaseNumber(ascCenterId: string, tx: Prisma.TransactionClient = prisma) {
    const today = new Date()
    const prefix = `RC-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`

    const count = await tx.repairCase.count({
      where: {
        ascCenterId,
        caseNumber: { startsWith: prefix },
      },
    })

    return `${prefix}-${String(count + 1).padStart(4, '0')}`
  }

  async create(input: CreateRepairCaseInput, userId: string) {
    return prisma.$transaction(async (tx) => {
      const caseNumber = await this.generateCaseNumber(input.ascCenterId, tx)
      
      const { statusReason, statusNotes, ...data } = input
      
      return tx.repairCase.create({
        data: {
          ...data,
          caseNumber,
          createdBy: userId,
          statusHistory: input.status
            ? {
                create: {
                  newStatus: input.status,
                  changedBy: userId,
                  reason: statusReason,
                  notes: statusNotes,
                },
              }
            : undefined,
        },
        select: repairCaseDetailSelect,
      }) as any
    })
  }

  async replace(id: string, input: ReplaceRepairCaseInput, userId: string) {
    return this.update(id, input, userId)
  }

  async update(id: string, input: UpdateRepairCaseInput, userId: string) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.repairCase.findUnique({ where: { id } })
      if (!existing) throw new Error('NOT_FOUND')

      const { statusReason, statusNotes, ...patch } = input
      const fieldHistoryData: Prisma.RepairCaseFieldHistoryCreateManyInput[] = []

      for (const [key, value] of Object.entries(patch)) {
        if (key === 'status') continue // Handled separately
        const oldVal = (existing as any)[key]
        if (oldVal !== value && value !== undefined) {
          fieldHistoryData.push({
            repairCaseId: id,
            fieldName: key,
            previousValue: oldVal !== null && oldVal !== undefined ? JSON.stringify(oldVal) : null,
            newValue: value !== null ? JSON.stringify(value) : null,
            changedBy: userId,
          })
        }
      }

      let statusHistoryCreate
      if (input.status && input.status !== existing.status) {
        statusHistoryCreate = {
          previousStatus: existing.status,
          newStatus: input.status,
          changedBy: userId,
          reason: statusReason,
          notes: statusNotes,
        }
      }

      const updated = await tx.repairCase.update({
        where: { id },
        data: {
          ...patch,
          ...(statusHistoryCreate && { statusHistory: { create: statusHistoryCreate } }),
        },
        select: repairCaseDetailSelect,
      })

      if (fieldHistoryData.length > 0) {
        await tx.repairCaseFieldHistory.createMany({
          data: fieldHistoryData,
        })
      }

      return updated as any
    })
  }

  async grantAccessories(repairCaseId: string, ascCenterId: string, items: any[], userId: string) {
    return prisma.$transaction(async (tx) => {
      const results: any[] = []

      for (const item of items) {
        // 1. Load AscAccessoryStock
        const stock = await tx.ascAccessoryStock.findUnique({
          where: { ascCenterId_accessoryId: { ascCenterId, accessoryId: item.accessoryId } },
        })

        if (!stock || stock.currentStock < item.quantity) {
          throw new Prisma.PrismaClientKnownRequestError('Out of stock', { code: 'P2002', clientVersion: '5' })
        }

        // 2. Decrement stock
        const newStock = stock.currentStock - item.quantity
        await tx.ascAccessoryStock.update({
          where: { id: stock.id },
          data: { currentStock: newStock, lastUpdated: new Date() },
        })

        // 3. Insert AccessoryStockTransaction
        await tx.accessoryStockTransaction.create({
          data: {
            accessoryId: item.accessoryId,
            ascCenterId,
            transactionType: 'issue',
            operation: 'out',
            quantity: item.quantity,
            balanceAfter: newStock,
            referenceType: 'repair_case',
            referenceId: repairCaseId,
            createdBy: userId,
            notes: item.notes,
          },
        })

        // 4. Insert RepairCaseAccessory
        let unitPrice = item.unitPrice
        if (unitPrice === undefined) {
          const acc = await tx.accessory.findUnique({ where: { id: item.accessoryId } })
          unitPrice = acc?.unitPrice || 0
        }

        const totalPrice = Number(unitPrice) * item.quantity

        const created = await tx.repairCaseAccessory.create({
          data: {
            repairCaseId,
            accessoryId: item.accessoryId,
            quantity: item.quantity,
            unitPrice,
            totalPrice,
            addedBy: userId,
          },
          include: {
            accessory: { select: { partNumber: true, name: true } },
            addedByUser: { select: { fullName: true } },
          },
        })
        results.push(created)
      }

      return results
    })
  }

  async revokeAccessory(repairCaseId: string, accessoryRowId: string, userId: string) {
    await prisma.$transaction(async (tx) => {
      const row = await tx.repairCaseAccessory.findUnique({
        where: { id: accessoryRowId, repairCaseId },
      })
      if (!row) throw new Error('NOT_FOUND')

      const caseRecord = await tx.repairCase.findUnique({ where: { id: repairCaseId }, select: { ascCenterId: true } })
      if (!caseRecord) throw new Error('NOT_FOUND')

      // 1. Increment stock
      const stock = await tx.ascAccessoryStock.findUnique({
        where: { ascCenterId_accessoryId: { ascCenterId: caseRecord.ascCenterId, accessoryId: row.accessoryId } },
      })

      const newStock = (stock?.currentStock || 0) + row.quantity
      if (stock) {
        await tx.ascAccessoryStock.update({
          where: { id: stock.id },
          data: { currentStock: newStock, lastUpdated: new Date() },
        })
      } else {
        await tx.ascAccessoryStock.create({
          data: {
            ascCenterId: caseRecord.ascCenterId,
            accessoryId: row.accessoryId,
            currentStock: newStock,
          },
        })
      }

      // 2. Compensating stock transaction
      await tx.accessoryStockTransaction.create({
        data: {
          accessoryId: row.accessoryId,
          ascCenterId: caseRecord.ascCenterId,
          transactionType: 'adjustment',
          operation: 'in',
          quantity: row.quantity,
          balanceAfter: newStock,
          referenceType: 'repair_case',
          referenceId: repairCaseId,
          createdBy: userId,
          notes: 'Revoked from repair case',
        },
      })

      // 3. Delete row
      await tx.repairCaseAccessory.delete({ where: { id: accessoryRowId } })

      // 4. Record Field History
      await tx.repairCaseFieldHistory.create({
        data: {
          repairCaseId,
          fieldName: 'accessory_removed',
          changeType: 'delete',
          changedBy: userId,
          metadata: { accessoryId: row.accessoryId, quantity: row.quantity, accessoryRowId },
        },
      })
    })
  }

  async addImages(repairCaseId: string, files: Express.Multer.File[], imageType: any, description: string | undefined, userId: string) {
    const data = files.map((f) => ({
      repairCaseId,
      imageType,
      imagePath: f.path,
      originalFilename: f.originalname,
      fileSize: f.size,
      mimeType: f.mimetype,
      description,
      uploadedBy: userId,
    }))

    await prisma.repairCaseImage.createMany({ data })
    
    // Postgres createMany doesn't return rows, so we find them
    return prisma.repairCaseImage.findMany({
      where: {
        repairCaseId,
        imageType,
        uploadedBy: userId,
      },
      orderBy: { uploadedAt: 'desc' },
      take: files.length,
      include: { uploader: { select: { fullName: true } } },
    }) as any
  }

  async deleteImage(repairCaseId: string, imageId: string) {
    await prisma.$transaction(async (tx) => {
      const img = await tx.repairCaseImage.findUnique({ where: { id: imageId, repairCaseId } })
      if (!img) throw new Error('NOT_FOUND')

      await tx.repairCaseImage.delete({ where: { id: imageId } })
      
      // In a real scenario we'd do fs.unlink, but the service handles that part if needed, or we just ignore
    })
  }
}
