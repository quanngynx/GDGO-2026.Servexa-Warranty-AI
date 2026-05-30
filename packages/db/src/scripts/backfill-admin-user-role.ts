import path from "node:path";
import { config } from "dotenv";

config({ path: path.resolve(process.cwd(), "../../apps/server/.env") });

const main = async () => {
  const prisma = (await import("../index.ts")).default;
  const user = await prisma.user.findFirst({
    where: { username: "admin" },
    include: { role: true },
  });
  if (!user) throw new Error("admin user not found");

  await prisma.userRole.upsert({
    where: {
      userId_roleId: { userId: user.id, roleId: user.roleId },
    },
    create: { userId: user.id, roleId: user.roleId },
    update: {},
  });

  console.log("Backfilled UserRole for admin", user.id, user.role.name);
};

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
