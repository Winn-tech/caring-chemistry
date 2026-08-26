import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };
// A placeholder keeps `next build` from opening a database connection while
// route modules are analysed. Requests still require a real DATABASE_URL.
const connectionString = process.env.DATABASE_URL ?? "postgresql://invalid:invalid@localhost:5432/invalid";

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
