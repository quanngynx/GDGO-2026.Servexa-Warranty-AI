import prisma from '../..'

export async function seedProductCatalog() {
  console.log('📦 Starting Product Catalog seeding...')

  // Category required by Model
  const category = await prisma.category.upsert({
    where: { name: 'LocknLock Hộp nhựa / Hộp thực phẩm' },
    update: {},
    create: {
      name: 'LocknLock Hộp nhựa / Hộp thực phẩm',
      description: 'Danh mục sản phẩm hộp nhựa và hộp thực phẩm LocknLock',
      laborCost: 50000,
      inspectionCost: 30000,
    },
  })

  // The model code searched for by repair-cases seed
  const model = await prisma.model.upsert({
    where: { modelCode: 'B32123091' },
    update: {},
    create: {
      categoryId: category.id,
      name: 'LocknLock Hộp thực phẩm B32123091',
      modelCode: 'B32123091',
      status: 'active',
      itemName: 'Food Container',
      globalCategory: 'Household',
      largeCategory: 'Food Storage',
      mediumCategory: 'Plastic Container',
      productName: 'LocknLock B32123091',
    },
  })

  console.log(`✅ Product Catalog seeding completed!
    - 1 Category: ${category.name}
    - 1 Model: ${model.modelCode} — ${model.name}`)
}
