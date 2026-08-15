import prisma from '../../../src/core/infra/prisma';
import { AscCenterStatus } from "../../../src/core/infra/prisma/generated/enums";

export async function seedASCCenters() {
  console.log("🏢 Starting ASC Centers seeding...");

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

  // Get Tây Ninh province for Long Hậu center
  const tayNinhProvince = await prisma.province.findFirst({
    where: { code: "TN" },
  });

  // Get some wards for location data
  const hcmWards = await prisma.ward.findMany({
    where: { provinceId: hcmProvince?.id },
    take: 3,
  });

  const hanoiWards = await prisma.ward.findMany({
    where: { provinceId: hanoiProvince?.id },
    take: 3,
  });

  const daNangWards = await prisma.ward.findMany({
    where: { provinceId: daNangProvince?.id },
    take: 1,
  });

  const canThoWards = await prisma.ward.findMany({
    where: { provinceId: canThoProvince?.id },
    take: 1,
  });

  // Get Cần Giuộc ward in Tây Ninh province
  const canGiuocWard = await prisma.ward.findFirst({
    where: {
      name: "Cần Giuộc",
      provinceId: tayNinhProvince?.id,
    },
  });

  const ascCenters = await Promise.all([
    // Ho Chi Minh City Centers
    prisma.ascCenter.upsert({
      where: { centerCode: 'ASC-HCM-001' },
      update: {},
      create: {
        centerName: 'LocknLock Service Center TP.HCM - Quận 1',
        centerCode: 'ASC-HCM-001',
        companyName: 'Công ty TNHH Dịch vụ LocknLock HCM',
        region: 'HCM',
        email: 'hcm01@locknlock-service.vn',
        address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
        phone: '028-3888-9999',
        licenseNumber: 'ASC-HCM-001-2024',
        status: AscCenterStatus.active,
        provinceId: hcmProvince?.id,
        wardId: hcmWards[0]?.id
      }
    }),

    prisma.ascCenter.upsert({
      where: { centerCode: 'ASC-HCM-002' },
      update: {},
      create: {
        centerName: 'LocknLock Service Center TP.HCM - Quận 3',
        centerCode: 'ASC-HCM-002',
        companyName: 'Công ty TNHH Dịch vụ LocknLock HCM',
        region: 'HCM',
        email: 'hcm02@locknlock-service.vn',
        address: '456 Võ Văn Tần, Phường 6, Quận 3, TP.HCM',
        phone: '028-3777-8888',
        licenseNumber: 'ASC-HCM-002-2024',
        status: AscCenterStatus.active,
        provinceId: hcmProvince?.id,
        wardId: hcmWards[1]?.id
      }
    }),

    prisma.ascCenter.upsert({
      where: { centerCode: 'ASC-HCM-003' },
      update: {},
      create: {
        centerName: 'LocknLock Service Center TP.HCM - Quận 7',
        centerCode: 'ASC-HCM-003',
        companyName: 'Công ty TNHH Dịch vụ LocknLock HCM',
        region: 'HCM',
        email: 'hcm03@locknlock-service.vn',
        address: '789 Nguyễn Thị Thập, Phường Tân Phú, Quận 7, TP.HCM',
        phone: '028-3666-7777',
        licenseNumber: 'ASC-HCM-003-2024',
        status: AscCenterStatus.active,
        provinceId: hcmProvince?.id,
        wardId: hcmWards[2]?.id
      }
    }),

    // LocknLock.LONGHAU Center
    prisma.ascCenter.upsert({
      where: { centerCode: 'LocknLock.LONGHAU' },
      update: {},
      create: {
        id: '64772c57-f0d4-4dc0-91fc-e533c985d6b4',
        centerName: 'LocknLock.LONGHAU',
        centerCode: 'LocknLock.LONGHAU',
        companyName: 'CHI NHÁNH CÔNG TY TNHH LOCK & LOCK HCM',
        region: 'HCM',
        email: 'khotonglonghau@gmail.com',
        address: 'Lô N-5, 7 đường số 6, khu công nghiệp Long Hậu mở rộng, Ấp 3, Xã Long Hậu',
        phone: '0907796818',
        licenseNumber: null,
        status: AscCenterStatus.active,
        provinceId: tayNinhProvince?.id,
        wardId: canGiuocWard?.id
      }
    }),

    // Hanoi Centers
    prisma.ascCenter.upsert({
      where: { centerCode: 'ASC-HN-001' },
      update: {},
      create: {
        centerName: 'LocknLock Service Center Hà Nội - Hoàn Kiếm',
        centerCode: 'ASC-HN-001',
        companyName: 'Công ty TNHH Dịch vụ LocknLock Hà Nội',
        region: 'North',
        email: 'hanoi01@locknlock-service.vn',
        address: '123 Phố Huế, Phường Phúc Tân, Quận Hoàn Kiếm, Hà Nội',
        phone: '024-3666-7777',
        licenseNumber: 'ASC-HN-001-2024',
        status: AscCenterStatus.active,
        provinceId: hanoiProvince?.id,
        wardId: hanoiWards[0]?.id
      }
    }),

    prisma.ascCenter.upsert({
      where: { centerCode: 'ASC-HN-002' },
      update: {},
      create: {
        centerName: 'LocknLock Service Center Hà Nội - Cầu Giấy',
        centerCode: 'ASC-HN-002',
        companyName: 'Công ty TNHH Dịch vụ LocknLock Hà Nội',
        region: 'North',
        email: 'hanoi02@locknlock-service.vn',
        address: '321 Nguyễn Trãi, Phường Thanh Xuân Trung, Quận Thanh Xuân, Hà Nội',
        phone: '024-3555-6666',
        licenseNumber: 'ASC-HN-002-2024',
        status: AscCenterStatus.active,
        provinceId: hanoiProvince?.id,
        wardId: hanoiWards[1]?.id
      }
    }),

    prisma.ascCenter.upsert({
      where: { centerCode: 'ASC-HN-003' },
      update: {},
      create: {
        centerName: 'LocknLock Service Center Hà Nội - Ba Đình',
        centerCode: 'ASC-HN-003',
        companyName: 'Công ty TNHH Dịch vụ LocknLock Hà Nội',
        region: 'North',
        email: 'hanoi03@locknlock-service.vn',
        address: '456 Đội Cấn, Phường Liễu Giai, Quận Ba Đình, Hà Nội',
        phone: '024-3444-5555',
        licenseNumber: 'ASC-HN-003-2024',
        status: AscCenterStatus.active,
        provinceId: hanoiProvince?.id,
        wardId: hanoiWards[2]?.id
      }
    }),

    // Da Nang Center
    prisma.ascCenter.upsert({
      where: { centerCode: 'ASC-DN-001' },
      update: {},
      create: {
        centerName: 'LocknLock Service Center Đà Nẵng',
        centerCode: 'ASC-DN-001',
        companyName: 'Công ty TNHH Dịch vụ LocknLock Đà Nẵng',
        region: 'Central',
        email: 'danang@locknlock-service.vn',
        address: '147 Trần Phú, Phường Thạch Thang, Quận Hải Châu, Đà Nẵng',
        phone: '0236-3444-5555',
        licenseNumber: 'ASC-DN-001-2024',
        status: AscCenterStatus.active,
        provinceId: daNangProvince?.id,
        wardId: daNangWards[0]?.id
      }
    }),

    // Can Tho Center
    prisma.ascCenter.upsert({
      where: { centerCode: 'ASC-CT-001' },
      update: {},
      create: {
        centerName: 'LocknLock Service Center Cần Thơ',
        centerCode: 'ASC-CT-001',
        companyName: 'Công ty TNHH Dịch vụ LocknLock Mekong',
        region: 'Mekong',
        email: 'cantho@locknlock-service.vn',
        address: '258 Mậu Thân, Phường An Phú, Quận Ninh Kiều, Cần Thơ',
        phone: '0292-3333-4444',
        licenseNumber: 'ASC-CT-001-2024',
        status: AscCenterStatus.active,
        provinceId: canThoProvince?.id,
        wardId: canThoWards[0]?.id
      }
    }),

    // Regional Centers for major provinces
    prisma.ascCenter.upsert({
      where: { centerCode: 'ASC-HP-001' },
      update: {},
      create: {
        centerName: 'LocknLock Service Center Hải Phòng',
        centerCode: 'ASC-HP-001',
        companyName: 'Công ty TNHH Dịch vụ LocknLock Hải Phòng',
        region: 'North',
        email: 'haiphong@locknlock-service.vn',
        address: '369 Lạch Tray, Phường Đông Khê, Quận Ngô Quyền, Hải Phòng',
        phone: '0225-3222-3333',
        licenseNumber: 'ASC-HP-001-2024',
        status: AscCenterStatus.active
      }
    }),

    prisma.ascCenter.upsert({
      where: { centerCode: 'ASC-BD-001' },
      update: {},
      create: {
        centerName: 'LocknLock Service Center Bình Dương',
        centerCode: 'ASC-BD-001',
        companyName: 'Công ty TNHH Dịch vụ LocknLock Bình Dương',
        region: 'South',
        email: 'binhduong@locknlock-service.vn',
        address: '741 Đại lộ Bình Dương, Phường Phú Hòa, TP. Thủ Dầu Một, Bình Dương',
        phone: '0274-3111-2222',
        licenseNumber: 'ASC-BD-001-2024',
        status: AscCenterStatus.active
      }
    }),

    // Temporary inactive center for testing
    prisma.ascCenter.upsert({
      where: { centerCode: 'ASC-TEST-001' },
      update: {},
      create: {
        centerName: 'LocknLock Service Center Test (Inactive)',
        centerCode: 'ASC-TEST-001',
        companyName: 'Test Company',
        region: 'Test',
        email: 'test@locknlock-service.vn',
        address: '999 Test Street, Test Ward, Test District, Test City',
        phone: '000-0000-0000',
        licenseNumber: 'ASC-TEST-001-2024',
        status: AscCenterStatus.inactive
      }
    })
  ]);

  console.log(`
    ASC Centers seeding completed successfully!
    Summary: ${ascCenters.length} ASC Centers created/updated
    Centers in major cities: HCM, Hà Nội, Đà Nẵng, Cần Thơ
    Regional centers: Hải Phòng, Bình Dương
    Test centers: 1 inactive center for testing
    ASC Centers Details:
  `);
  ascCenters.forEach(center => {
    console.log(`-> ${center.centerCode}: ${center.centerName} (${center.status})`);
  });
}
