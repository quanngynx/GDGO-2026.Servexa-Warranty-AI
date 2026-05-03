import prisma from '../..'

export async function seedHumanResources() {
  console.log('👥 Starting Human Resources seeding...')

  // ── Customer ──────────────────────────────────────────────────────────────
  // repair-cases looks for phone1 = "0987654321" or customerGroup = "individual"
  const customer = await prisma.customer.upsert({
    where: { id: 'seed-customer-001' },
    update: {},
    create: {
      id: 'seed-customer-001',
      customerGroup: 'individual',
      fullName: 'Nguyễn Văn An',
      phone1: '0987654321',
      email: 'nguyenvanan@example.com',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    },
  })

  // ── Employee (technician) ─────────────────────────────────────────────────
  // repair-cases looks for employeeCode = "EMP-2024-000001" or position in technician roles.
  // Employee.ascCenterId is required — use ASC-HCM-001 which is always seeded first.
  const ascCenter = await prisma.ascCenter.findFirst({
    where: { centerCode: 'ASC-HCM-001' },
  })
  if (!ascCenter) {
    throw new Error('ASC Center ASC-HCM-001 not found. Run seedASCCenters first.')
  }

  const adminUser = await prisma.user.findFirst({
    where: { username: 'admin' },
  })
  if (!adminUser) {
    throw new Error('Admin user not found. Run seedIdentityUser first.')
  }

  const employee = await prisma.employee.upsert({
    where: { employeeCode: 'EMP-2024-000001' },
    update: {},
    create: {
      employeeCode: 'EMP-2024-000001',
      gender: 'male',
      fullName: 'Trần Văn Kỹ Thuật',
      dateOfBirth: new Date('1990-05-15'),
      primaryPhone: '0909123456',
      email: 'technician001@servexa-warranty.com',
      permanentAddress: '456 Lê Lợi, Quận 1, TP.HCM',
      department: 'technical',
      position: 'home_appliance_technician',
      startDate: new Date('2024-01-01'),
      ascCenterId: ascCenter.id,
      baseSalary: 12000000,
      nationalId: '079090001234',
      idIssueDate: new Date('2015-06-01'),
      idAddress: 'Hồ Chí Minh',
      idIssuingAuthority: 'CA TP.HCM',
      createdBy: adminUser.id,
    },
  })

  console.log(`✅ Human Resources seeding completed!
    - 1 Customer: ${customer.fullName} (${customer.phone1})
    - 1 Employee: ${employee.employeeCode} — ${employee.fullName} (${employee.position})`)
}
