import prisma from '../../../src/core/infra/prisma'

export async function seedPurchaseChannels() {
  console.log('📦 Starting Purchase Channels seeding...')

  // Seed PurchaseLocationGroup
  const group = await prisma.purchaseLocationGroup.upsert({
    where: { code: 'SM_GRP_01' },
    update: {},
    create: {
      name: 'Supermarkets',
      code: 'SM_GRP_01',
      description: 'Supermarket channel',
      isActive: true,
      sortOrder: 1,
    },
  })

  // Seed PurchaseLocation
  const location = await prisma.purchaseLocation.upsert({
    where: { code: 'DMX_HCM_01' },
    update: {},
    create: {
      groupId: group.id,
      name: 'Dien May Xanh - District 1',
      code: 'DMX_HCM_01',
      description: 'Main DMX in District 1',
      address: 'District 1, HCM',
      isActive: true,
      sortOrder: 1,
    },
  })

  console.log(`✅ Purchase Channels seeding completed!
    - 1 Group: ${group.code} — ${group.name}
    - 1 Location: ${location.code} — ${location.name}`)
}
