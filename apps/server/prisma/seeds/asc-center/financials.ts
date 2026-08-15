import prisma from '../../../src/core/infra/prisma'
import {
  DeliveryStatus,
  PaymentStatus,
  PurchaseOrderStatus,
  QuotationStatus,
} from '../../../src/core/infra/prisma/generated/enums'

export async function seedFinancials() {
  console.log('Starting Financials seeding...')

  const repairCase = await prisma.repairCase.findFirst()
  const ascCenter = await prisma.ascCenter.findFirst()
  const user = await prisma.user.findFirst()
  const accessory = await prisma.accessory.findFirst()

  if (!repairCase || !ascCenter || !user || !accessory) {
    console.warn('Skipping Financials seed: Missing dependencies.')
    return
  }

  // Payment Period & Payment
  const period = await prisma.paymentPeriod.create({
    data: {
      name: 'July 2024 Payment Period',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-07-31'),
    },
  })

  await prisma.payment.create({
    data: {
      paymentNumber: 'PAY-2024-001',
      repairCaseId: repairCase.id,
      caseNumber: repairCase.caseNumber,
      status: PaymentStatus.paid,
      ascCenterId: ascCenter.id,
      totalCost: 150000,
      laborOrInspection: 100000,
      shippingCost: 50000,
      paymentPeriodId: period.id,
    },
  })

  // Quotation
  await prisma.quotation.upsert({
    where: { quotationNumber: 'QUO-2024-001' },
    update: {},
    create: {
      repairCaseId: repairCase.id,
      quotationNumber: 'QUO-2024-001',
      status: QuotationStatus.approved,
      laborCost: 100000,
      partsCost: 50000,
      totalCost: 150000,
      finalAmount: 150000,
      createdBy: user.id,
      approvedBy: user.id,
    },
  })

  // Purchase Order
  await prisma.purchaseOrder.upsert({
    where: { orderNumber: 'PO-2024-001' },
    update: {},
    create: {
      orderNumber: 'PO-2024-001',
      ascCenterId: ascCenter.id,
      supplierName: 'ABC Accessories Co.',
      orderDate: new Date(),
      status: PurchaseOrderStatus.received,
      totalAmount: 500000,
      paymentStatus: PaymentStatus.paid,
      createdBy: user.id,
      items: {
        create: [
          {
            accessoryId: accessory.id,
            orderedQuantity: 10,
            receivedQuantity: 10,
            unitPrice: 50000,
            totalPrice: 500000,
            deliveryStatus: DeliveryStatus.received,
          },
        ],
      },
    },
  })

  console.log('Financials seeded.')
}
