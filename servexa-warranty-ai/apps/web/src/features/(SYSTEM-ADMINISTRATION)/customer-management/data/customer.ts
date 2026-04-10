import { faker } from "@faker-js/faker";

// Set a fixed seed for consistent data generation
faker.seed(67890);

export const customers = Array.from({ length: 500 }, () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = faker.internet
    .username({ firstName, lastName })
    .toLocaleLowerCase();
  return {
    id: faker.string.uuid(),
    customerGroup: faker.helpers.arrayElement(["individual", "other"]),
    fullname: `${firstName} ${lastName}`,
    phone1: faker.phone.number({ style: "international" }),
    phone2: faker.phone.number({ style: "international" }),
    email: faker.internet.email({ firstName, lastName }).toLocaleLowerCase(),
    province: faker.location.state(),
    provinceId: faker.string.uuid(),
    ward: faker.location.city(),
    wardId: faker.string.uuid(),
    address: faker.location.streetAddress(),
    taxCode: faker.string.alphanumeric(10),
    bankName: faker.company.name(),
    accountNumber: faker.string.alphanumeric(10),
    contactPerson: faker.person.fullName(),
    ascCenter: {
      id: faker.string.uuid(),
      centerName: faker.company.name(),
      centerCode: `${1100019020}_{${faker.string.alphanumeric(3).toUpperCase()}}`,
    },
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    createdBy: `${username} - ${faker.person.firstName()} ${faker.person.lastName()}`,
    updatedBy: null,
    _count: {
      repairCases: faker.number.int({ min: 0, max: 100 }),
    },
  };
});

export const responseCustomers = {
  success: true,
  status: 200,
  data: {
    items: customers,
    pagination: {
      page: 1,
      limit: 10,
      total: customers.length,
      totalPages: Math.ceil(customers.length / 10),
      hasNext: true,
      hasPrev: false,
    },
  },
  message: "Customers fetched successfully",
  timestamp: new Date().toISOString(),
};
