import { createPrismaClient } from "./prisma";
import { IoredisService } from "./ioredis/ioredis-service";

const prisma = createPrismaClient();

export default prisma;
export { IoredisService };
