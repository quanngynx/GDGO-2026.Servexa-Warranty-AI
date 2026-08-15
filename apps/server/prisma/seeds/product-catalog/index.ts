import prisma from '../../../src/core/infra/prisma'
import { seedCategories } from './categories'
import { seedModels } from './models'

export async function seedProductCatalog() {
  console.log('Starting Product Catalog seeding...')

  const categories = await seedCategories()
  const models = await seedModels()

  // Seed for TotalWarehouse
  let totalWarehouse = await prisma.totalWarehouse.findFirst({
    where: { name: 'Main Central Warehouse HCM' },
  })
  if (!totalWarehouse) {
    totalWarehouse = await prisma.totalWarehouse.create({
      data: {
        name: 'Main Central Warehouse HCM',
        address: 'District 1, Ho Chi Minh City',
        status: 'active',
      },
    })
  }

  console.log(`Product Catalog seeding completed!
    - ${categories.length} Categories seeded
    - ${models.length} Models seeded
    - 1 TotalWarehouse: ${totalWarehouse.name}`)
}
