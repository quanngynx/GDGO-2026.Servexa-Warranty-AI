import prisma from '../../../src/core/infra/prisma'
import {
  StockOperation,
  StockTransactionType,
} from '../../../src/core/infra/prisma/generated/enums'

export async function seedAccessoryStock() {
  console.log('Starting Accessory Stock seeding...')

  const ascCenter = await prisma.ascCenter.findFirst()
  const user = await prisma.user.findFirst()
  let accessory = await prisma.accessory.findFirst()

  if (!accessory) {
    const category = await prisma.category.findFirst()
    if (category) {
      accessory = await prisma.accessory.create({
        data: {
          name: 'Test Accessory 1',
          partNumber: 'ACC-001',
          categoryId: category.id,
          stockQuantity: 100,
          minStockLevel: 10,
        },
      })
    }
  }

  if (!ascCenter || !user || !accessory) {
    console.warn('Skipping Accessory Stock seed: Missing dependencies (ascCenter, user, accessory).')
    return
  }

  // Create initial stock
  const ascStock = await prisma.ascAccessoryStock.upsert({
    where: {
      ascCenterId_accessoryId: {
        ascCenterId: ascCenter.id,
        accessoryId: accessory.id,
      },
    },
    update: {},
    create: {
      ascCenterId: ascCenter.id,
      accessoryId: accessory.id,
      currentStock: 100,
      reservedStock: 10,
      minStockLevel: 20,
      maxStockLevel: 500,
    },
  })

  // Create a stock transaction
  await prisma.accessoryStockTransaction.create({
    data: {
      accessoryId: accessory.id,
      ascCenterId: ascCenter.id,
      transactionType: StockTransactionType.initial_stock,
      operation: StockOperation.in,
      quantity: 100,
      balanceAfter: 100,
      createdBy: user.id,
      notes: 'Initial stock import',
    },
  })

  // Create a stocktake
  const stocktake = await prisma.ascStocktake.create({
    data: {
      ascCenterId: ascCenter.id,
      createdBy: user.id,
      notes: 'Monthly stocktake for July',
      items: {
        create: [
          {
            accessoryId: accessory.id,
            previousQty: 100,
            newQty: 95,
            deltaQty: -5,
            notes: 'Found 5 missing',
          },
        ],
      },
    },
  })

  console.log('Accessory Stock seeded.')
}
