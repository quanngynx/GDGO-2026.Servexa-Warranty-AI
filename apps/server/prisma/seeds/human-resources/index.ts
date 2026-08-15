import prisma from '../../../src/core/infra/prisma'
import { seedCustomers } from './customer'

export async function seedHumanResources() {
  console.log('👥 Starting Human Resources seeding...')

  // ── Customer ──────────────────────────────────────────────────────────────
  await seedCustomers()

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

  const technicianUser = await prisma.user.upsert({
    where: { username: 'technician' },
    update: {
      ascCenterId: ascCenter.id,
      deletedAt: null,
      status: 'active',
    },
    create: {
      username: 'technician',
      fullName: 'Trần Văn Kỹ Thuật',
      companyEmail: 'technician@servexa-warranty.com',
      password: adminUser.password,
      roleId: adminUser.roleId,
      ascCenterId: ascCenter.id,
      status: 'active',
    },
    select: { id: true, username: true },
  })

  const technicianProfile = await prisma.technicianProfile.upsert({
    where: { userId: technicianUser.id },
    update: { isAvailable: true },
    create: {
      user: { connect: { id: technicianUser.id } },
      ascCenter: { connect: { id: ascCenter.id } },
      skillLevel: 'intermediate',
      specializations: ['general_repair'],
      experienceYears: 5,
      maxConcurrentCases: 5,
      isAvailable: true,
    },
    select: { id: true, userId: true },
  })

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
    - 1 Employee: ${employee.employeeCode} — ${employee.fullName} (${employee.position})
    - 1 Technician profile: ${technicianProfile.id} (user: ${technicianUser.username})`)
}
