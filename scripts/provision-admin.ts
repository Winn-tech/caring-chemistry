import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient, Role } from "../src/generated/prisma/client";

const args = process.argv.slice(2);
const value = (name: string) => args[args.indexOf(name) + 1];
const name = value("--name");
const email = value("--email")?.toLowerCase();
const password = process.env.ADMIN_INITIAL_PASSWORD;

if (!name || !email || !password) {
  throw new Error("Usage: ADMIN_INITIAL_PASSWORD='a long password' npm run admin:provision -- --name \"Platform Admin\" --email admin@example.com");
}
if (password.length < 12) throw new Error("ADMIN_INITIAL_PASSWORD must be at least 12 characters.");
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
const initialPassword = password;

async function main() {
  const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }) });
  try {
    if (await prisma.user.count({ where: { role: Role.GENERAL_ADMIN } })) throw new Error("A General Admin already exists. Use the protected staff API to add more staff.");
    const user = await prisma.user.create({ data: { name, email, passwordHash: await bcrypt.hash(initialPassword, 12), role: Role.GENERAL_ADMIN } });
    await prisma.auditLog.create({ data: { actorId: user.id, action: "ADMIN_PROVISIONED", entity: "User", entityId: user.id, metadata: { role: user.role } } });
    console.log(`Created General Admin: ${user.email}`);
  } finally { await prisma.$disconnect(); }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
