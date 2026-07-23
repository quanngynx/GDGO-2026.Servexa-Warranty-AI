import prisma from '../../../src/core/infra/prisma'
import {
  PaymentPendingStatus,
  RepairCaseImageType,
} from '../../../src/core/infra/prisma/generated/enums'

export async function seedRepairCaseDetails() {
  console.log('Starting Repair Case Details seeding...')

  const repairCase = await prisma.repairCase.findFirst()
  const user = await prisma.user.findFirst()
  const accessory = await prisma.accessory.findFirst()

  if (!repairCase || !user) {
    console.warn('Skipping Repair Case Details seed: Missing dependencies (repairCase, user).')
    return
  }

  // Repair Case Payment Detail
  const paymentDetail = await prisma.repairCasePaymentDetail.findUnique({
    where: { repairCaseId: repairCase.id },
  })
  
  if (!paymentDetail) {
    await prisma.repairCasePaymentDetail.create({
      data: {
        repairCaseId: repairCase.id,
        paymentProcessedBy: user.id,
        paymentProcessedAt: new Date(),
        paymentApproved: true,
        paymentApprovedBy: user.id,
        paymentPendingStatus: PaymentPendingStatus.paid,
      },
    })
  }

  // Wait / Error accessories
  await prisma.waitAccessoryItem.create({
    data: {
      repairCaseId: repairCase.id,
      partName: 'Screen Panel',
      quantity: 1,
    },
  })

  await prisma.errorAccessoryItem.create({
    data: {
      repairCaseId: repairCase.id,
      partName: 'Faulty Motherboard',
      quantity: 1,
    },
  })

  // Repair Case Accessory
  if (accessory) {
    await prisma.repairCaseAccessory.create({
      data: {
        repairCaseId: repairCase.id,
        accessoryId: accessory.id,
        quantity: 1,
        addedBy: user.id,
      },
    })
  }

  // Repair Case Image
  await prisma.repairCaseImage.create({
    data: {
      repairCaseId: repairCase.id,
      imageType: RepairCaseImageType.before_repair,
      imagePath: 'https://example.com/image.jpg',
      uploadedBy: user.id,
    },
  })

  // Field History
  await prisma.repairCaseFieldHistory.create({
    data: {
      repairCaseId: repairCase.id,
      fieldName: 'status',
      changeType: 'update',
      changedBy: user.id,
      previousValue: 'tiepnhan',
      newValue: 'dangsua',
    },
  })

  console.log('Repair Case Details seeded.')
}
