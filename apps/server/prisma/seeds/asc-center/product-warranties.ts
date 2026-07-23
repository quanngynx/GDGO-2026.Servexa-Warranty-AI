import prisma from '../../../src/core/infra/prisma'
import {
  ProductWarrantyStatus,
  WarrantyClaimStatus,
  WarrantyClaimType,
  WarrantyClaimUrgency,
  WarrantyCoordinationPriority,
  WarrantyCoordinationStatus,
  WarrantyCoordinationType,
  WarrantyType,
} from '../../../src/core/infra/prisma/generated/enums'

export async function seedProductWarranties() {
  console.log('Starting Product Warranties seeding...')

  // Fetch dependencies
  const model = await prisma.model.findFirst()
  const customer = await prisma.customer.findFirst()
  const ascCenter = await prisma.ascCenter.findFirst({ where: { centerCode: 'ASC-HCM-001' } })
  const otherAscCenter = await prisma.ascCenter.findFirst({ where: { centerCode: 'ASC-HN-001' } })
  let warrantyPolicy = await prisma.warrantyPolicy.findFirst()
  const user = await prisma.user.findFirst()

  if (!warrantyPolicy && model) {
    warrantyPolicy = await prisma.warrantyPolicy.create({
      data: {
        modelId: model.id,
        warrantyType: WarrantyType.standard,
        warrantyDurationMonths: 12,
        effectiveFrom: new Date('2020-01-01'),
        coverageDescription: 'Standard 1 year warranty',
      },
    })
  }

  if (!model || !customer || !ascCenter || !warrantyPolicy || !user) {
    console.warn('⚠️ Skipping Product Warranties seed: Missing required dependencies (model, customer, ascCenter, warrantyPolicy, user).')
    return
  }

  const w1 = await prisma.productWarranty.upsert({
    where: {
      modelId_serialNumber: {
        modelId: model.id,
        serialNumber: 'SN-001-TEST',
      },
    },
    update: {},
    create: {
      modelId: model.id,
      serialNumber: 'SN-001-TEST',
      customerName: customer.fullName,
      customerPhone: customer.phone1,
      purchaseDate: new Date('2024-01-01'),
      warrantyStartDate: new Date('2024-01-01'),
      warrantyEndDate: new Date('2025-01-01'),
      warrantyPolicyId: warrantyPolicy.id,
      ascCenterId: ascCenter.id,
      status: ProductWarrantyStatus.active,
      registeredBy: user.id,
      registrationDate: new Date('2024-01-05'),
    },
  })

  const w2 = await prisma.productWarranty.upsert({
    where: {
      modelId_serialNumber: {
        modelId: model.id,
        serialNumber: 'SN-002-TEST',
      },
    },
    update: {},
    create: {
      modelId: model.id,
      serialNumber: 'SN-002-TEST',
      customerName: customer.fullName,
      customerPhone: customer.phone1,
      purchaseDate: new Date('2023-01-01'),
      warrantyStartDate: new Date('2023-01-01'),
      warrantyEndDate: new Date('2024-01-01'),
      warrantyPolicyId: warrantyPolicy.id,
      ascCenterId: ascCenter.id,
      status: ProductWarrantyStatus.expired,
    },
  })

  const claim1 = await prisma.warrantyClaim.upsert({
    where: { claimNumber: 'CLAIM-2024-001' },
    update: {},
    create: {
      claimNumber: 'CLAIM-2024-001',
      productWarrantyId: w1.id,
      ascCenterId: ascCenter.id,
      claimType: WarrantyClaimType.repair,
      claimDate: new Date('2024-05-01'),
      issueDescription: 'Product not turning on',
      status: WarrantyClaimStatus.submitted,
      urgencyLevel: WarrantyClaimUrgency.high,
      createdBy: user.id,
    },
  })

  if (otherAscCenter) {
    await prisma.warrantyCoordination.create({
      data: {
        warrantyClaimId: claim1.id,
        coordinationType: WarrantyCoordinationType.part_request,
        coordinatorAscId: ascCenter.id,
        targetAscId: otherAscCenter.id,
        message: 'Do you have spare part X for this claim?',
        priority: WarrantyCoordinationPriority.high,
        status: WarrantyCoordinationStatus.pending,
        createdBy: user.id,
      },
    })
  }

  console.log('Product Warranties seeded.')
}
