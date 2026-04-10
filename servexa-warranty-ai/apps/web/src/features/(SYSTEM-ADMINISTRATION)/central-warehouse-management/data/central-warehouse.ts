import { faker } from "@faker-js/faker";

// Set a fixed seed for consistent data generation
faker.seed(67890);

export const users = Array.from({ length: 500 }, () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = faker.internet
    .username({ firstName, lastName })
    .toLocaleLowerCase();
  return {
    id: faker.string.uuid(),
    fullname: `${firstName} ${lastName}`,
    username,
    phoneNumber: faker.phone.number({ style: "international" }),
    companyEmail: faker.internet
      .email({ firstName, lastName })
      .toLocaleLowerCase(),
    personalEmail: faker.internet.email({ firstName }).toLocaleLowerCase(),
    avatar: faker.image.avatar(),
    status: faker.helpers.arrayElement([
      "active",
      "inactive",
      "invited",
      "suspended",
    ]),
    role: faker.helpers.arrayElement([
      "superadmin",
      "admin",
      "cashier",
      "manager",
    ]),
    ascCenter: {
      id: faker.string.uuid(),
      centerName: faker.company.name(),
      centerCode: `${1100019020}_{${faker.string.alphanumeric(3).toUpperCase()}}`,
    },
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    createdBy: `${username} - ${faker.person.firstName()} ${faker.person.lastName()}`,
    updatedBy: null,
  };
});

export const responseUsers = {
  success: true,
  status: 200,
  data: {
    items: users,
    pagination: {
      page: 1,
      limit: 10,
      total: users.length,
      totalPages: Math.ceil(users.length / 10),
      hasNext: true,
      hasPrev: false,
    },
  },
  message: "Users fetched successfully",
  timestamp: new Date().toISOString(),
};
