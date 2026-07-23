import prisma from '../../../src/core/infra/prisma'
import {
  AccessoryIssueItemStatus,
  AccessoryIssueStatus,
  AccessoryRequestItemStatus,
  AccessoryRequestStatus,
  AccessoryRequestUrgency,
  IssuePurpose,
  SupplyVoucherStatus,
} from '../../../src/core/infra/prisma/generated/enums'

export async function seedAccessoryOperations() {
  console.log('🔄 Starting Accessory Operations seeding...')

  const ascCenter = await prisma.ascCenter.findFirst()
  const user = await prisma.user.findFirst()
  const accessory = await prisma.accessory.findFirst()
  const customer = await prisma.customer.findFirst()
  const repairCase = await prisma.repairCase.findFirst()

  if (!ascCenter || !user || !accessory || !customer) {
    console.warn('⚠️ Skipping Accessory Operations seed: Missing dependencies.')
    return
  }

  // Accessory Request
  const request = await prisma.accessoryRequest.upsert({
    where: { requestNumber: 'REQ-2024-001' },
    update: {},
    create: {
      requestNumber: 'REQ-2024-001',
      ascCenterId: ascCenter.id,
      requestedBy: user.id,
      requestDate: new Date(),
      urgency: AccessoryRequestUrgency.normal,
      status: AccessoryRequestStatus.approved,
      approvedBy: user.id,
      approvedDate: new Date(),
      items: {
        create: [
          {
            accessoryId: accessory.id,
            requestedQuantity: 5,
            approvedQuantity: 5,
            status: AccessoryRequestItemStatus.fully_approved,
          },
        ],
      },
    },
  })

  // Supply Voucher
  const voucher = await prisma.accessorySupplyVoucher.upsert({
    where: { voucherNumber: 'SUP-2024-001' },
    update: {},
    create: {
      voucherNumber: 'SUP-2024-001',
      ascCenterId: ascCenter.id,
      issueDate: new Date(),
      status: SupplyVoucherStatus.issued,
      issuedBy: user.id,
      requestId: request.id,
      items: {
        create: [
          {
            accessoryId: accessory.id,
            qtyIssued: 5,
          },
        ],
      },
    },
  })

  // Accessory Issue
  await prisma.accessoryIssue.upsert({
    where: { issueNumber: 'ISS-2024-001' },
    update: {},
    create: {
      issueNumber: 'ISS-2024-001',
      ascCenterId: ascCenter.id,
      issuedToUserId: user.id,
      issuedBy: user.id,
      issuePurpose: IssuePurpose.repair_case,
      repairCaseId: repairCase?.id,
      issueDate: new Date(),
      status: AccessoryIssueStatus.issued,
      items: {
        create: [
          {
            accessoryId: accessory.id,
            issuedQuantity: 1,
            status: AccessoryIssueItemStatus.issued,
          },
        ],
      },
    },
  })

  // Retail Voucher
  await prisma.accessoryRetailVoucher.upsert({
    where: { voucherNumber: 'RET-2024-001' },
    update: {},
    create: {
      voucherNumber: 'RET-2024-001',
      customerId: customer.id,
      ascCenterId: ascCenter.id,
      createdBy: user.id,
      items: {
        create: [
          {
            accessoryId: accessory.id,
            qtyIssued: 2,
          },
        ],
      },
    },
  })

  if (repairCase) {
    await prisma.accessoryIsUsedOutsideOfWarranty.create({
      data: {
        ascCenterId: ascCenter.id,
        repairCaseId: repairCase.id,
        accessoryId: accessory.id,
        name: 'Extra Cable',
        usedQuantity: 1,
        unitPrice: 50000,
        taxRate: 10,
        totalPrice: 55000,
      },
    })
  }

  console.log('✅ Accessory Operations seeded.')
}
