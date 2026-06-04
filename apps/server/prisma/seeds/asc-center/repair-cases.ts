import prisma from "../..";
import {
  FoodSafetyCompliance,
  HouseholdProductType,
  PlasticDurabilityLevel,
  RepairCasePriority,
  RepairCaseStatus,
  SatisfactionRating,
  SealIntegrityStatus,
  WarrantyForm,
  WarrantyServiceType,
} from "../../../prisma/generated/enums";

export type SeedRepairCasesOptions = {
  ascCenterId: string
  areaId: string
  modelId: string
  technicianId: string
  customerId: string
}

export async function seedRepairCases() {
  console.log("🔧 Starting repair cases seeding with warranty workflow...");

  // Get existing data
  const ascCenter = await prisma.ascCenter.findFirst({
    where: { centerCode: "ASC-HCM-001" },
  });

  const area = await prisma.area.findFirst({
    where: {
      OR: [
        { name: "Khu vực Nguyễn Huệ" },
        { name: { contains: "HCM" } },
        { name: { contains: "Hồ Chí Minh" } },
      ],
    },
  });

  const model = await prisma.model.findFirst({
    where: {
      OR: [{ modelCode: "B32123091" }, { modelCode: { contains: "B32" } }],
    },
  });

  const superAdmin = await prisma.user.findFirst({
    where: { username: "admin" },
  });

  // Try to find any admin user that belongs to an ASC center
  const ascAdmin = await prisma.user.findFirst({
    where: {
      OR: [
        { username: "hcm_admin" },
        { username: "hanoi_admin" },
        { ascCenterId: { not: null } },
      ],
    },
  });

  const technician = await prisma.employee.findFirst({
    where: {
      OR: [
        { employeeCode: "EMP-2024-000001" },
        { position: "home_appliance_technician" },
        { position: "workshop_technician" },
      ],
    },
  });

  // Get a technician user for status history (use any admin as fallback)
  const technicianUser = await prisma.user.findFirst({
    where: {
      OR: [
        { username: "hanoi_admin" },
        { username: "hcm_admin" },
        { ascCenterId: { not: null } },
      ],
    },
  });

  const customer = await prisma.customer.findFirst({
    where: {
      OR: [{ phone1: "0987654321" }, { customerGroup: "individual" }],
    },
  });

  // Validate required data exists or create fallbacks
  if (!ascCenter) {
    throw new Error(
      "Missing required seed data: ascCenter. Please run ASC centers seeding first.",
    );
  }

  if (!area) {
    console.log("⚠️ No specific area found, creating a fallback area...");

    // Area requires non-nullable provinceId & wardId — resolve them from ascCenter or any existing record
    const fallbackProvinceId =
      ascCenter.provinceId ??
      (await prisma.province.findFirst().then((p) => p?.id))

    const fallbackWardId =
      ascCenter.wardId ??
      (await prisma.ward.findFirst().then((w) => w?.id))

    if (!fallbackProvinceId || !fallbackWardId) {
      throw new Error(
        'Cannot create fallback area: no province or ward found in the database. Please seed location data first.',
      )
    }

    await prisma.area.create({
      data: {
        provinceId: fallbackProvinceId,
        wardId: fallbackWardId,
        name: "Khu vực mặc định",
        cayso: "CS-DEFAULT-001",
        tiencong1: 100000.0,
        tiencong2: 130000.0,
      },
    });
    console.log("✅ Created fallback area");
  }

  if (!model) {
    throw new Error(
      "Missing required seed data: model. Please run LocknLock products seeding first.",
    );
  }

  if (!superAdmin) {
    throw new Error(
      "Missing required seed data: superAdmin (admin user). Please run main seeding first.",
    );
  }

  if (!ascAdmin) {
    console.log("⚠️ No ASC admin found, using super admin as fallback");
  }

  if (!technician) {
    throw new Error(
      "Missing required seed data: technician. Please run employee seeding first.",
    );
  }

  if (!technicianUser) {
    console.log("⚠️ No technician user found, using super admin as fallback");
  }

  if (!customer) {
    throw new Error(
      "Missing required seed data: customer. Please run main seeding first.",
    );
  }

  const finalArea = area || (await prisma.area.findFirst());
  const finalAscAdmin = ascAdmin || superAdmin;
  const finalTechnicianUser = technicianUser || superAdmin;

  if (!finalArea) {
    throw new Error("Could not find or create area for repair cases");
  }

  // Create repair cases demonstrating Vietnamese warranty workflow statuses
  console.log("📋 Creating repair cases with Vietnamese warranty workflow...");

  // Case 1: tiepnhan (Receipt of repair request)
  const case1 = await prisma.repairCase.upsert({
    where: { caseNumber: "RC-2024-000001" },
    update: {},
    create: {
      caseNumber: "RC-2024-000001",
      ascCenterId: ascCenter.id,
      areaId: finalArea.id,
      customerId: customer.id,
      status: RepairCaseStatus.tiepnhan,
      priority: RepairCasePriority.normal,
      modelId: model.id,
      serialNumber: "B32123091-2024-001",
      purchaseDate: new Date("2024-01-15"),
      locknlockCaseNumber: "LL-2024-001",
      warrantyForm: WarrantyForm.in_warranty,
      warrantyServiceType: WarrantyServiceType.at_asc,
      damageDescription: "Nắp hộp không đóng kín, mất tính năng hút chân không",
      receivedDate: new Date("2024-07-01"),
      promisedDeliveryDate: new Date("2024-07-08"),
      assignedEmployeeId: technician.id,
      createdBy: finalAscAdmin.id,
      householdProductType: HouseholdProductType.food_storage_container,
      foodSafetyCompliance: FoodSafetyCompliance.pending_test,
      sealIntegrityStatus: SealIntegrityStatus.poor,
      plasticDurabilityLevel: PlasticDurabilityLevel.good,
    },
  });

  // Case 2: xuly (Processing/Under repair)
  const slaRiskPromisedDate = new Date();
  slaRiskPromisedDate.setDate(slaRiskPromisedDate.getDate() - 2);

  const case2 = await prisma.repairCase.upsert({
    where: { caseNumber: "RC-2024-000002" },
    update: {
      priority: RepairCasePriority.high,
      promisedDeliveryDate: slaRiskPromisedDate,
      diagnosis:
        "Repeated seal failure on same model — SLA at risk; escalate if parts delayed",
    },
    create: {
      caseNumber: "RC-2024-000002",
      ascCenterId: ascCenter.id,
      areaId: finalArea.id,
      customerId: customer.id,
      status: RepairCaseStatus.dangsua,
      priority: RepairCasePriority.high,
      modelId: model.id,
      serialNumber: "B32123091-2024-002",
      purchaseDate: new Date("2024-02-10"),
      locknlockCaseNumber: "LL-2024-002",
      warrantyForm: WarrantyForm.warranty_repair,
      warrantyServiceType: WarrantyServiceType.at_asc,
      damageDescription: "Thân hộp bị nứt, không thể sử dụng",
      diagnosis: "Vết nứt do va đập, cần thay thế thân hộp",
      receivedDate: new Date("2024-06-28"),
      promisedDeliveryDate: slaRiskPromisedDate,
      assignedEmployeeId: technician.id,
      createdBy: finalAscAdmin.id,
      householdProductType: HouseholdProductType.glass_container,
      foodSafetyCompliance: FoodSafetyCompliance.compliant,
      sealIntegrityStatus: SealIntegrityStatus.not_tested,
      plasticDurabilityLevel: PlasticDurabilityLevel.not_tested,
    },
  });

  // Case 3: chocaplk (Waiting for parts allocation)
  const case3 = await prisma.repairCase.upsert({
    where: { caseNumber: "RC-2024-000003" },
    update: {},
    create: {
      caseNumber: "RC-2024-000003",
      ascCenterId: ascCenter.id,
      areaId: finalArea.id,
      customerId: customer.id,
      status: RepairCaseStatus.chocaplk,
      priority: RepairCasePriority.normal,
      modelId: model.id,
      serialNumber: "B32123091-2024-003",
      purchaseDate: new Date("2024-03-20"),
      locknlockCaseNumber: "LL-2024-003",
      warrantyForm: WarrantyForm.in_warranty,
      warrantyServiceType: WarrantyServiceType.at_asc,
      damageDescription: "Gioăng cao su bị hỏng, cần thay thế",
      diagnosis: "Gioăng cao su bị lão hóa, cần linh kiện thay thế",
      repairSolution: "Thay thế gioăng cao su mới",
      receivedDate: new Date("2024-06-25"),
      promisedDeliveryDate: new Date("2024-07-10"),
      assignedEmployeeId: technician.id,
      createdBy: finalAscAdmin.id,
      householdProductType: HouseholdProductType.vacuum_container,
      foodSafetyCompliance: FoodSafetyCompliance.compliant,
      sealIntegrityStatus: SealIntegrityStatus.failed,
      plasticDurabilityLevel: PlasticDurabilityLevel.good,
    },
  });

  // Case 4: chocaplk (Waiting for parts allocation)
  const case4 = await prisma.repairCase.upsert({
    where: { caseNumber: "RC-2024-000004" },
    update: {},
    create: {
      caseNumber: "RC-2024-000004",
      ascCenterId: ascCenter.id,
      areaId: finalArea.id,
      customerId: customer.id,
      status: RepairCaseStatus.chocaplk,
      priority: RepairCasePriority.normal,
      modelId: model.id,
      serialNumber: "B32123091-2024-004",
      purchaseDate: new Date("2024-01-05"),
      locknlockCaseNumber: "LL-2024-004",
      warrantyForm: WarrantyForm.in_warranty,
      warrantyServiceType: WarrantyServiceType.at_asc,
      damageDescription: "Nắp hộp bị vỡ hoàn toàn",
      diagnosis: "Nắp hộp bị vỡ do va đập mạnh, cần thay thế hoàn toàn",
      repairSolution: "Thay thế nắp hộp mới",
      receivedDate: new Date("2024-06-20"),
      promisedDeliveryDate: new Date("2024-07-15"),
      assignedEmployeeId: technician.id,
      createdBy: finalAscAdmin.id,
      householdProductType: HouseholdProductType.plastic_container,
      foodSafetyCompliance: FoodSafetyCompliance.pending_test,
      sealIntegrityStatus: SealIntegrityStatus.failed,
      plasticDurabilityLevel: PlasticDurabilityLevel.cracked,
    },
  });

  // Case 5: hoanthanh (Repair completed)
  const case5 = await prisma.repairCase.upsert({
    where: { caseNumber: "RC-2024-000005" },
    update: {},
    create: {
      caseNumber: "RC-2024-000005",
      ascCenterId: ascCenter.id,
      areaId: finalArea.id,
      customerId: customer.id,
      status: RepairCaseStatus.hoanthanh,
      priority: RepairCasePriority.normal,
      modelId: model.id,
      serialNumber: "B32123091-2024-005",
      purchaseDate: new Date("2024-04-10"),
      locknlockCaseNumber: "LL-2024-005",
      warrantyForm: WarrantyForm.warranty_repair,
      warrantyServiceType: WarrantyServiceType.at_asc,
      damageDescription: "Khóa hộp bị kẹt, không mở được",
      diagnosis: "Cơ chế khóa bị bám bẩn, cần vệ sinh và bôi trơn",
      repairSolution: "Vệ sinh cơ chế khóa và bôi trơn",
      repairNotes: "Đã hoàn thành sửa chữa, kiểm tra chất lượng OK",
      totalCost: 50000.0,
      laborCost: 50000.0,
      partsCost: 0.0,
      receivedDate: new Date("2024-06-15"),
      promisedDeliveryDate: new Date("2024-06-22"),
      actualCompletionDate: new Date("2024-06-21"),
      assignedEmployeeId: technician.id,
      createdBy: finalAscAdmin.id,
      householdProductType: HouseholdProductType.lunch_box,
      foodSafetyCompliance: FoodSafetyCompliance.compliant,
      sealIntegrityStatus: SealIntegrityStatus.excellent,
      plasticDurabilityLevel: PlasticDurabilityLevel.excellent,
    },
  });

  // Case 6: dagiao (Delivered to customer)
  const case6 = await prisma.repairCase.upsert({
    where: { caseNumber: "RC-2024-000006" },
    update: {},
    create: {
      caseNumber: "RC-2024-000006",
      ascCenterId: ascCenter.id,
      areaId: finalArea.id,
      customerId: customer.id,
      status: RepairCaseStatus.dagiao,
      priority: RepairCasePriority.normal,
      modelId: model.id,
      serialNumber: "B32123091-2024-006",
      purchaseDate: new Date("2024-05-01"),
      locknlockCaseNumber: "LL-2024-006",
      warrantyForm: WarrantyForm.in_warranty,
      warrantyServiceType: WarrantyServiceType.at_asc,
      damageDescription: "Mất tính năng hút chân không",
      diagnosis: "Van hút chân không bị tắc, cần thay thế",
      repairSolution: "Thay thế van hút chân không mới",
      repairNotes: "Đã hoàn thành sửa chữa và giao cho khách hàng",
      totalCost: 120000.0,
      laborCost: 80000.0,
      partsCost: 40000.0,
      receivedDate: new Date("2024-06-10"),
      promisedDeliveryDate: new Date("2024-06-17"),
      actualCompletionDate: new Date("2024-06-16"),
      assignedEmployeeId: technician.id,
      createdBy: finalAscAdmin.id,
      householdProductType: HouseholdProductType.vacuum_container,
      foodSafetyCompliance: FoodSafetyCompliance.compliant,
      sealIntegrityStatus: SealIntegrityStatus.excellent,
      plasticDurabilityLevel: PlasticDurabilityLevel.good,
    },
  });

  // Case 7: hoanthanh (Completed - will show complete workflow in history)
  const case7 = await prisma.repairCase.upsert({
    where: { caseNumber: "RC-2024-000007" },
    update: {},
    create: {
      caseNumber: "RC-2024-000007",
      ascCenterId: ascCenter.id,
      areaId: finalArea.id,
      customerId: customer.id,
      status: RepairCaseStatus.hoanthanh,
      priority: RepairCasePriority.normal,
      modelId: model.id,
      serialNumber: "B32123091-2024-007",
      purchaseDate: new Date("2024-03-15"),
      locknlockCaseNumber: "LL-2024-007",
      warrantyForm: WarrantyForm.warranty_repair,
      warrantyServiceType: WarrantyServiceType.at_asc,
      damageDescription: "Toàn bộ hộp bị biến dạng",
      diagnosis: "Hộp bị biến dạng do nhiệt độ cao, cần thay thế",
      repairSolution: "Thay thế hộp mới hoàn toàn",
      repairNotes: "Đã hoàn thành quy trình bảo hành và thanh toán",
      totalCost: 250000.0,
      laborCost: 100000.0,
      partsCost: 150000.0,
      receivedDate: new Date("2024-06-01"),
      promisedDeliveryDate: new Date("2024-06-15"),
      actualCompletionDate: new Date("2024-06-14"),
      paymentDate: new Date("2024-06-20"),
      assignedEmployeeId: technician.id,
      createdBy: finalAscAdmin.id,
      satisfaction: {
        create: {
          satisfactionRating: SatisfactionRating.very_satisfied,
          satisfactionComment: "Dịch vụ tốt, sản phẩm được sửa chữa chất lượng",
          satisfactionDate: new Date("2024-06-21"),
          satisfactionCollectedBy: finalAscAdmin.id,
        },
      },
      householdProductType: HouseholdProductType.food_storage_container,
      foodSafetyCompliance: FoodSafetyCompliance.compliant,
      sealIntegrityStatus: SealIntegrityStatus.excellent,
      plasticDurabilityLevel: PlasticDurabilityLevel.excellent,
    },
  });

  // Case 8: choykienkhach (Waiting for customer's decision)
  const case8 = await prisma.repairCase.upsert({
    where: { caseNumber: "RC-2024-000008" },
    update: {},
    create: {
      caseNumber: "RC-2024-000008",
      ascCenterId: ascCenter.id,
      areaId: finalArea.id,
      customerId: customer.id,
      status: RepairCaseStatus.choykienkhach,
      priority: RepairCasePriority.normal,
      modelId: model.id,
      serialNumber: "B32123091-2024-008",
      purchaseDate: new Date("2024-05-12"),
      locknlockCaseNumber: "LL-2024-008",
      warrantyForm: WarrantyForm.in_warranty,
      warrantyServiceType: WarrantyServiceType.at_asc,
      damageDescription: "Cần thay linh kiện, chờ khách xác nhận chi phí",
      diagnosis: "Đã chẩn đoán và báo giá cho khách",
      receivedDate: new Date("2024-06-12"),
      promisedDeliveryDate: new Date("2024-06-20"),
      assignedEmployeeId: technician.id,
      createdBy: finalAscAdmin.id,
    },
  });

  // Case 9: khachkhongsua (Customer declines repair)
  const case9 = await prisma.repairCase.upsert({
    where: { caseNumber: "RC-2024-000009" },
    update: {},
    create: {
      caseNumber: "RC-2024-000009",
      ascCenterId: ascCenter.id,
      areaId: finalArea.id,
      customerId: customer.id,
      status: RepairCaseStatus.khachkhongsua,
      priority: RepairCasePriority.low,
      modelId: model.id,
      serialNumber: "B32123091-2024-009",
      purchaseDate: new Date("2024-02-22"),
      locknlockCaseNumber: "LL-2024-009",
      warrantyForm: WarrantyForm.in_warranty,
      warrantyServiceType: WarrantyServiceType.at_asc,
      damageDescription: "Khách từ chối sửa do chi phí cao",
      diagnosis: "Cần thay linh kiện giá cao, khách không đồng ý",
      receivedDate: new Date("2024-06-08"),
      promisedDeliveryDate: new Date("2024-06-15"),
      assignedEmployeeId: technician.id,
      createdBy: finalAscAdmin.id,
    },
  });

  // Case 10: khongsuaduoc (Cannot be repaired)
  const case10 = await prisma.repairCase.upsert({
    where: { caseNumber: "RC-2024-000010" },
    update: {},
    create: {
      caseNumber: "RC-2024-000010",
      ascCenterId: ascCenter.id,
      areaId: finalArea.id,
      customerId: customer.id,
      status: RepairCaseStatus.khongsuaduoc,
      priority: RepairCasePriority.high,
      modelId: model.id,
      serialNumber: "B32123091-2024-010",
      purchaseDate: new Date("2024-01-30"),
      locknlockCaseNumber: "LL-2024-010",
      warrantyForm: WarrantyForm.in_warranty,
      warrantyServiceType: WarrantyServiceType.at_asc,
      damageDescription: "Sản phẩm hư hỏng nặng không thể sửa chữa",
      diagnosis: "Vỡ cấu trúc, không thể phục hồi",
      receivedDate: new Date("2024-06-05"),
      promisedDeliveryDate: new Date("2024-06-12"),
      assignedEmployeeId: technician.id,
      createdBy: finalAscAdmin.id,
      warrantyResolution: "Đổi sản phẩm mới",
    },
  });

  // Case 11: khongsuaduoc with different warranty resolution
  const case11 = await prisma.repairCase.upsert({
    where: { caseNumber: "RC-2024-000011" },
    update: {},
    create: {
      caseNumber: "RC-2024-000011",
      ascCenterId: ascCenter.id,
      areaId: finalArea.id,
      customerId: customer.id,
      status: RepairCaseStatus.khongsuaduoc,
      priority: RepairCasePriority.normal,
      modelId: model.id,
      serialNumber: "B32123091-2024-011",
      purchaseDate: new Date("2024-03-08"),
      locknlockCaseNumber: "LL-2024-011",
      warrantyForm: WarrantyForm.in_warranty,
      warrantyServiceType: WarrantyServiceType.at_asc,
      damageDescription: "Sản phẩm bị lỗi thiết kế",
      diagnosis: "Lỗi thiết kế từ nhà sản xuất",
      receivedDate: new Date("2024-06-03"),
      promisedDeliveryDate: new Date("2024-06-10"),
      assignedEmployeeId: technician.id,
      createdBy: finalAscAdmin.id,
      warrantyResolution: "Hoàn tiền",
    },
  });

  // Case 12: khongsuaduoc with another warranty resolution
  const case12 = await prisma.repairCase.upsert({
    where: { caseNumber: "RC-2024-000012" },
    update: {},
    create: {
      caseNumber: "RC-2024-000012",
      ascCenterId: ascCenter.id,
      areaId: finalArea.id,
      customerId: customer.id,
      status: RepairCaseStatus.khongsuaduoc,
      priority: RepairCasePriority.low,
      modelId: model.id,
      serialNumber: "B32123091-2024-012",
      purchaseDate: new Date("2024-04-15"),
      locknlockCaseNumber: "LL-2024-012",
      warrantyForm: WarrantyForm.in_warranty,
      warrantyServiceType: WarrantyServiceType.at_asc,
      damageDescription: "Sản phẩm bị lỗi vận chuyển",
      diagnosis: "Hư hỏng do vận chuyển, không phải lỗi sản phẩm",
      receivedDate: new Date("2024-06-01"),
      promisedDeliveryDate: new Date("2024-06-08"),
      assignedEmployeeId: technician.id,
      createdBy: finalAscAdmin.id,
      warrantyResolution: "Đổi sản phẩm khác",
    },
  });

  const repairCases = [
    case1,
    case2,
    case3,
    case4,
    case5,
    case6,
    case7,
    case8,
    case9,
    case10,
    case11,
    case12,
  ];

  console.log("📊 Creating status transition history...");

  // Create status transition history for completed cases
  // Check if status history already exists to avoid duplicates
  const existingHistory = await prisma.repairCaseStatusHistory.findFirst({
    where: { repairCaseId: case7.id },
  });

  if (!existingHistory) {
    await prisma.repairCaseStatusHistory.createMany({
      data: [
        // Case 7 complete workflow
        {
          repairCaseId: case7.id,
          previousStatus: null,
          newStatus: RepairCaseStatus.tiepnhan,
          changedBy: finalAscAdmin.id,
          reason: "Khách hàng mang sản phẩm đến ASC",
          notes: "Tiếp nhận ca sửa chữa mới",
          changedAt: new Date("2024-06-01T09:00:00Z"),
        },
        {
          repairCaseId: case7.id,
          previousStatus: RepairCaseStatus.tiepnhan,
          newStatus: RepairCaseStatus.dangsua,
          changedBy: finalTechnicianUser.id,
          reason: "Bắt đầu quá trình chẩn đoán và sửa chữa",
          notes: "Kỹ thuật viên tiếp nhận ca sửa chữa",
          changedAt: new Date("2024-06-02T08:30:00Z"),
        },
        {
          repairCaseId: case7.id,
          previousStatus: RepairCaseStatus.dangsua,
          newStatus: RepairCaseStatus.hoanthanh,
          changedBy: finalTechnicianUser.id,
          reason: "Hoàn thành sửa chữa thành công",
          notes: "Đã thay thế hộp mới, kiểm tra chất lượng OK",
          changedAt: new Date("2024-06-14T16:00:00Z"),
        },
        {
          repairCaseId: case7.id,
          previousStatus: RepairCaseStatus.hoanthanh,
          newStatus: RepairCaseStatus.dagiao,
          changedBy: finalAscAdmin.id,
          reason: "Giao sản phẩm cho khách hàng",
          notes: "Khách hàng đã nhận sản phẩm và hài lòng",
          changedAt: new Date("2024-06-15T10:00:00Z"),
        },
        {
          repairCaseId: case7.id,
          previousStatus: RepairCaseStatus.dagiao,
          newStatus: RepairCaseStatus.hoanthanh,
          changedBy: superAdmin.id,
          reason: "Hoàn tất quy trình bảo hành",
          notes: "Công ty xác nhận hoàn thành ca sửa chữa",
          changedAt: new Date("2024-06-18T14:00:00Z"),
        },
      ],
    });
  }

  console.log(`✅ Repair cases seeding completed successfully!\n
    📊 Created:
    - ${repairCases.length} Repair Cases (demonstrating warranty workflow)\n
    - 6 Status Transition History records (complete workflow example)\n
    - Vietnamese warranty workflow statuses represented\n
    - Vietnamese business compliance data included\n
    - Household product-specific assessments\n
    - Warranty resolution examples: Đổi sản phẩm mới, Hoàn tiền, Đổi sản phẩm khác\n
    `);
}
