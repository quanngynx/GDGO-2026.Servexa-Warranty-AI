import prisma from '../../../src/core/infra/prisma'

export async function seedModels() {
  console.log('  Seeding Models...')
  
  const categoryFoodContainer = await prisma.category.findUnique({
    where: { name: 'LocknLock Hộp nhựa / Hộp thực phẩm' }
  })
  
  const categoryThermos = await prisma.category.findUnique({
    where: { name: 'LocknLock Bình giữ nhiệt' }
  })
  
  const categoryAirFryer = await prisma.category.findUnique({
    where: { name: 'LocknLock Nồi chiên không dầu' }
  })

  if (!categoryFoodContainer || !categoryThermos || !categoryAirFryer) {
    console.warn('Some categories were not found. Please seed categories first.')
    return []
  }

  const models = [
    {
      categoryId: categoryFoodContainer.id,
      name: 'LocknLock Hộp thực phẩm B32123091',
      modelCode: 'B32123091',
      status: 'active' as const,
      itemName: 'Food Container',
      globalCategory: 'Household',
      largeCategory: 'Food Storage',
      mediumCategory: 'Plastic Container',
      productName: 'LocknLock B32123091',
    },
    {
      categoryId: categoryThermos.id,
      name: 'Bình giữ nhiệt LocknLock LHC4151',
      modelCode: 'LHC4151',
      status: 'active' as const,
      itemName: 'Thermos',
      globalCategory: 'Household',
      largeCategory: 'Drinkware',
      mediumCategory: 'Vacuum Flask',
      productName: 'LocknLock LHC4151',
    },
    {
      categoryId: categoryAirFryer.id,
      name: 'Nồi chiên không dầu LocknLock EJF357',
      modelCode: 'EJF357',
      status: 'active' as const,
      itemName: 'Air Fryer',
      globalCategory: 'Kitchen Appliance',
      largeCategory: 'Cooking Appliance',
      mediumCategory: 'Air Fryer',
      productName: 'LocknLock EJF357',
    }
  ]

  const seededModels = []
  for (const data of models) {
    const model = await prisma.model.upsert({
      where: { modelCode: data.modelCode },
      update: {},
      create: data,
    })
    seededModels.push(model)
  }

  return seededModels
}
