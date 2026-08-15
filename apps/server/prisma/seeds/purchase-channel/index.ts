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
  const locationData = [
    {
      code: 'DMX_HCM_01',
      name: 'Dien May Xanh - District 1',
      description: 'Main DMX in District 1',
      address: 'District 1, HCM',
      sortOrder: 1,
    },
    {
      code: 'DMX_HCM_02',
      name: 'Dien May Xanh - District 2',
      description: 'DMX in District 2',
      address: 'District 2, HCM',
      sortOrder: 2,
    },
    {
      code: 'NK_HCM_01',
      name: 'Nguyen Kim - District 1',
      description: 'Nguyen Kim in District 1',
      address: 'District 1, HCM',
      sortOrder: 3,
    },
    {
      code: 'CL_HCM_05',
      name: 'Dien May Cho Lon - District 5',
      description: 'Dien May Cho Lon in District 5',
      address: 'District 5, HCM',
      sortOrder: 4,
    },
    {
      code: 'PV_HCM_03',
      name: 'Phong Vu - District 3',
      description: 'Phong Vu in District 3',
      address: 'District 3, HCM',
      sortOrder: 5,
    },
    {
      code: 'FPT_HCM_01',
      name: 'FPT Shop - District 1',
      description: 'FPT Shop in District 1',
      address: 'District 1, HCM',
      sortOrder: 6,
    }
  ]

  for (const loc of locationData) {
    await prisma.purchaseLocation.upsert({
      where: { code: loc.code },
      update: {},
      create: {
        groupId: group.id,
        name: loc.name,
        code: loc.code,
        description: loc.description,
        address: loc.address,
        isActive: true,
        sortOrder: loc.sortOrder,
      },
    })
  }

  console.log(`✅ Purchase Channels seeding completed!
    - 1 Group: ${group.code} — ${group.name}
    - ${locationData.length} Locations`)
}
