import prisma from '../../../src/core/infra/prisma'

export async function seedRecalls() {
  console.log('Starting Recalls seeding...')

  const repairCase = await prisma.repairCase.findFirst()
  const user = await prisma.user.findFirst()

  if (!repairCase || !user) {
    console.warn('Skipping Recalls seed: Missing dependencies.')
    return
  }

  // Product Replacement Recall
  await prisma.productReplacementRecall.upsert({
    where: { recallNumber: 'THDM-20240701-001' },
    update: {},
    create: {
      recallNumber: 'THDM-20240701-001',
      createdBy: user.id,
      notes: 'Recall due to widespread component failure',
      totalCases: 1,
      repairCases: {
        create: [
          {
            repairCaseId: repairCase.id,
          },
        ],
      },
    },
  })

  console.log('Recalls seeded.')
}
