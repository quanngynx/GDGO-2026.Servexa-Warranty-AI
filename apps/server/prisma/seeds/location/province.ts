import prisma from '../../../src/core/infra/prisma'

export async function seedProvinces() {
  return await Promise.all([
    // Northern Vietnam
    prisma.province.upsert({
      where: { code: 'HN' },
      update: {},
      create: { name: 'Hà Nội', code: 'HN' }
    }),
    prisma.province.upsert({
      where: { code: 'HP' },
      update: {},
      create: { name: 'Hải Phòng', code: 'HP' }
    }),
    prisma.province.upsert({
      where: { code: 'QN' },
      update: {},
      create: { name: 'Quảng Ninh', code: 'QN' }
    }),
    // Central Vietnam
    prisma.province.upsert({
      where: { code: 'DN' },
      update: {},
      create: { name: 'Đà Nẵng', code: 'DN' }
    }),
    prisma.province.upsert({
      where: { code: 'HU' },
      update: {},
      create: { name: 'Thừa Thiên Huế', code: 'HU' }
    }),
    prisma.province.upsert({
      where: { code: 'QNA' },
      update: {},
      create: { name: 'Quảng Nam', code: 'QNA' }
    }),
    // Southern Vietnam
    prisma.province.upsert({
      where: { code: 'HCM' },
      update: {},
      create: { name: 'Hồ Chí Minh', code: 'HCM' }
    }),
    prisma.province.upsert({
      where: { code: 'BD' },
      update: {},
      create: { name: 'Bình Dương', code: 'BD' }
    }),
    prisma.province.upsert({
      where: { code: 'DN2' },
      update: {},
      create: { name: 'Đồng Nai', code: 'DN2' }
    }),
    prisma.province.upsert({
      where: { code: 'CT' },
      update: {},
        create: { name: 'Cần Thơ', code: 'CT' }
        })
    ]);
}