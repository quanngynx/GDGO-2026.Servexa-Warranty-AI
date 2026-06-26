import prisma from '../../../src/core/infra/prisma';
import type { Area } from "../../../src/core/infra/prisma/generated/browser";

export async function seedAreas() {
  console.log("🗺️ Starting Areas seeding...");
  // Get existing geographic data for reference
  const hcmProvince = await prisma.province.findFirst({
    where: { code: "HCM" },
  });

  const hanoiProvince = await prisma.province.findFirst({
    where: { code: "HN" },
  });

  const daNangProvince = await prisma.province.findFirst({
    where: { code: "DN" },
  });

  const canThoProvince = await prisma.province.findFirst({
    where: { code: "CT" },
  });

  // Validate required data exists
  if (!hcmProvince) {
    throw new Error("HCM Province not found. Please run main seeding first.");
  }
  if (!hanoiProvince) {
    throw new Error("Hanoi Province not found. Please run main seeding first.");
  }
  if (!daNangProvince) {
    throw new Error("Da Nang Province not found. Please run main seeding first.");
  }
  if (!canThoProvince) {
    throw new Error("Can Tho Province not found. Please run main seeding first.");
  }

  // Get existing wards for each province
  const hcmWards = await prisma.ward.findMany({
    where: { provinceId: hcmProvince.id },
    take: 10, // Limit to avoid too many areas
  });

  const hanoiWards = await prisma.ward.findMany({
    where: { provinceId: hanoiProvince.id },
    take: 10,
  });

  const daNangWards = daNangProvince
    ? await prisma.ward.findMany({
        where: { provinceId: daNangProvince.id },
        take: 5,
      })
    : [];

  const canThoWards = canThoProvince
    ? await prisma.ward.findMany({
        where: { provinceId: canThoProvince.id },
        take: 5,
      })
    : [];

  const hcmAreas: Promise<Area>[] = [];
  const hanoiAreas: Promise<Area>[] = [];
  const daNangAreas: Promise<Area>[] = [];
  const canThoAreas: Promise<Area>[] = [];

  hcmWards.forEach((ward, index) => {
    const areaNames = [
      "Khu vực Nguyễn Huệ",
      "Khu vực Lê Lợi",
      "Khu vực Võ Văn Tần",
      "Khu vực Nam Kỳ Khởi Nghĩa",
      "Khu vực Phú Mỹ Hưng",
      "Khu vực Tân Bình",
      "Khu vực Gò Vấp",
      "Khu vực Bình Thạnh",
      "Khu vực Thủ Đức",
      "Khu vực Quận 7",
    ];

    if (index < areaNames.length) {
      hcmAreas.push(
        prisma.area.upsert({
          where: { wardId_name: { wardId: ward.id, name: areaNames[index]! } },
          update: {},
          create: {
            provinceId: hcmProvince.id,
            wardId: ward.id,
            name: areaNames[index]!,
            cayso: `CS-HCM-${(index + 1).toString().padStart(3, "0")}`,
            tiencong1: 130000.0 + index * 10000,
            tiencong2: 160000.0 + index * 10000,
          },
        }),
      );
    }
  });

  if (daNangProvince && daNangWards.length > 0) {
    daNangWards.forEach((ward, index) => {
      const areaNames = [
        "Khu vực Hải Châu",
        "Khu vực Thanh Khê",
        "Khu vực Sơn Trà",
        "Khu vực Ngũ Hành Sơn",
        "Khu vực Liên Chiểu",
      ];

      if (index < areaNames.length) {
        daNangAreas.push(
          prisma.area.upsert({
            where: {
              wardId_name: { wardId: ward.id!, name: areaNames[index]! },
            },
            update: {},
            create: {
              provinceId: daNangProvince.id,
              wardId: ward.id!,
              name: areaNames[index]!,
              cayso: `CS-DN-${(index + 1).toString().padStart(3, "0")}`,
              tiencong1: 105000.0 + index * 5000,
              tiencong2: 135000.0 + index * 5000,
            },
          }),
        );
      }
    });
  }

  if (canThoProvince && canThoWards.length > 0) {
    canThoWards.forEach((ward, index) => {
      const areaNames = [
        "Khu vực Ninh Kiều",
        "Khu vực Cái Răng",
        "Khu vực Bình Thủy",
        "Khu vực Ô Môn",
        "Khu vực Thốt Nốt",
      ];

      if (index < areaNames.length) {
        canThoAreas.push(
          prisma.area.upsert({
            where: {
              wardId_name: { wardId: ward.id, name: areaNames[index]! },
            },
            update: {},
            create: {
              provinceId: canThoProvince.id,
              wardId: ward.id,
              name: areaNames[index]!,
              cayso: `CS-CT-${(index + 1).toString().padStart(3, "0")}`,
              tiencong1: 95000.0 + index * 5000,
              tiencong2: 125000.0 + index * 5000,
            },
          }),
        );
      }
    });
  }

  // Execute all area creation promises
  const allAreas = [...hcmAreas, ...hanoiAreas, ...daNangAreas, ...canThoAreas];

  console.log(`🏗️ Creating ${allAreas.length} service areas...`);
  const createdAreas = await Promise.all(allAreas);

  // Additional specialized areas for different service types
  console.log('🔧 Creating specialized service areas...');
  const specializedAreas: Promise<Area>[] = [];

  // Industrial areas in HCM (if we have extra wards)
  if (hcmWards.length > 5) {
    const industrialWard = hcmWards[5]; // Use 6th ward for industrial area
    if (!industrialWard) {
      throw new Error('Industrial ward not found');
    }
    specializedAreas.push(
      prisma.area.upsert({
        where: { wardId_name: { wardId: industrialWard.id, name: 'Khu công nghiệp Tân Thuận' } },
        update: {},
        create: {
          provinceId: hcmProvince.id,
          wardId: industrialWard.id,
          name: 'Khu công nghiệp Tân Thuận',
          cayso: 'CS-HCM-KCNTT-101',
          tiencong1: 200000.00,
          tiencong2: 250000.00
        }
      })
    );
  }

  // Residential areas with different pricing tiers
  if (hcmWards.length > 6) {
    const residentialWard = hcmWards[6]; // Use 7th ward for residential area
    if (!residentialWard) {
      throw new Error('Residential ward not found');
    }
    specializedAreas.push(
      prisma.area.upsert({
        where: { wardId_name: { wardId: residentialWard.id, name: 'Khu dân cư cao cấp' } },
        update: {},
        create: {
          provinceId: hcmProvince.id,
          wardId: residentialWard.id,
          name: 'Khu dân cư cao cấp',
          cayso: 'CS-HCM-KDCCC-102',
          tiencong1: 180000.00,
          tiencong2: 220000.00
        }
      })
    );
  }

  // University areas in Hanoi
  if (hanoiWards.length > 5) {
    const universityWard = hanoiWards[5]; // Use 6th ward for university area
    if (!universityWard) {
      throw new Error('University ward not found');
    }
    specializedAreas.push(
      prisma.area.upsert({
        where: { wardId_name: { wardId: universityWard.id, name: 'Khu vực Đại học Quốc gia' } },
        update: {},
        create: {
          provinceId: hanoiProvince.id,
          wardId: universityWard.id,
          name: 'Khu vực Đại học Quốc gia',
          cayso: 'CS-HN-DHQG-101',
          tiencong1: 105000.00,
          tiencong2: 135000.00
        }
      })
    );
  }

  const createdSpecializedAreas = await Promise.all(specializedAreas);

  const totalAreas = createdAreas.length + createdSpecializedAreas.length;

  console.log(`✅ Areas seeding completed successfully!\n
   📊 Created:\n
    - ${totalAreas} Service Areas across major cities\n
    - ${hcmAreas.length} HCM City areas created\n
    - ${hanoiAreas.length} Hanoi areas created\n
    - ${daNangAreas.length} Da Nang areas created\n
    - ${canThoAreas.length} Can Tho areas created\n
    - ${createdSpecializedAreas.length} Specialized service areas\n
    - Service fees ranging from 95,000 to 250,000 VND\n
    - Complete geographic coverage with province-ward hierarchy\n
  `);
}
