import prisma from '../../../src/core/infra/prisma'
import { CustomerGroup } from '../../../src/core/infra/prisma/generated/enums'

export async function seedCustomers() {
  console.log('👥 Starting Customers seeding...')

  const customersData = [
    {
      id: 'seed-customer-001',
      customerGroup: CustomerGroup.individual,
      fullName: 'Nguyễn Văn An',
      phone1: '0987654321',
      email: 'nguyenvanan@example.com',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    },
    {
      id: 'seed-customer-002',
      customerGroup: CustomerGroup.individual,
      fullName: 'Trần Thị Bình',
      phone1: '0912345678',
      email: 'tranthibinh@example.com',
      address: '456 Lê Lợi, Quận 1, TP.HCM',
    },
    {
      id: 'seed-customer-003',
      customerGroup: CustomerGroup.company,
      fullName: 'Công ty TNHH ABC',
      phone1: '02838123456',
      email: 'contact@abc.com.vn',
      address: '789 Võ Văn Tần, Quận 3, TP.HCM',
      taxCode: '0312345678',
      contactPerson: 'Lê Văn Cường',
    },
    {
      id: 'seed-customer-004',
      customerGroup: CustomerGroup.company,
      fullName: 'Công ty CP XYZ',
      phone1: '02838654321',
      email: 'info@xyz.com.vn',
      address: '321 Điện Biên Phủ, Bình Thạnh, TP.HCM',
      taxCode: '0398765432',
      contactPerson: 'Phạm Thị Dung',
    },
    {
      id: 'seed-customer-005',
      customerGroup: CustomerGroup.individual,
      fullName: 'Hoàng Văn E',
      phone1: '0909999888',
      email: 'hoangvane@example.com',
      address: '12 Nguyễn Trãi, Quận 5, TP.HCM',
    }
  ]

  let count = 0
  for (const data of customersData) {
    await prisma.customer.upsert({
      where: { id: data.id },
      update: {},
      create: {
        id: data.id,
        customerGroup: data.customerGroup,
        fullName: data.fullName,
        phone1: data.phone1,
        email: data.email,
        address: data.address,
        taxCode: data.taxCode,
        contactPerson: data.contactPerson,
      },
    })
    count++
  }

  console.log(`✅ Customers seeding completed! Seeded ${count} customers.`)
}
