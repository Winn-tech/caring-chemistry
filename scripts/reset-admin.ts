import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient, Role } from "../src/generated/prisma/client";

const args = process.argv.slice(2);
const value = (name: string) => args[args.indexOf(name) + 1];
const email = value("--email")?.toLowerCase();
const password = process.env.ADMIN_RESET_PASSWORD;

if (!email || !password) {
  throw new Error("Usage: ADMIN_RESET_PASSWORD='a long password' npm run admin:reset -- --email admin@example.com");
}
if (password.length < 12) throw new Error("ADMIN_RESET_PASSWORD must be at least 12 characters.");
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
const resetPassword = password;

async function main() {
  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }) });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || (user.role !== Role.GENERAL_ADMIN && user.role !== Role.SALES_TEAM && user.role !== Role.SOCIAL_TEAM)) {
      throw new Error("No admin or staff account found for that email.");
    }
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(resetPassword, 12) } });
    console.log(`Reset password for: ${user.email}`);
  } finally { await prisma.$disconnect(); }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });