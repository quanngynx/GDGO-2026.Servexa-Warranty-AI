import prisma from '../../../src/core/infra/prisma'

export async function seedCategories() {
  console.log('  Seeding Categories...')
  const categories = [
    {
      name: 'LocknLock Hộp nhựa / Hộp thực phẩm',
      description: 'Danh mục sản phẩm hộp nhựa và hộp thực phẩm LocknLock',
      laborCost: 50000,
      inspectionCost: 30000,
    },
    {
      name: 'LocknLock Bình giữ nhiệt',
      description: 'Danh mục sản phẩm bình giữ nhiệt LocknLock',
      laborCost: 60000,
      inspectionCost: 35000,
    },
    {
      name: 'LocknLock Nồi chiên không dầu',
      description: 'Danh mục sản phẩm nồi chiên không dầu LocknLock',
      laborCost: 150000,
      inspectionCost: 50000,
    }
  ]

  const seededCategories = []
  for (const data of categories) {
    const category = await prisma.category.upsert({
      where: { name: data.name },
      update: {},
      create: data,
    })
    seededCategories.push(category)
  }

  return seededCategories
}
