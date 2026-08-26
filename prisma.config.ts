import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // Neon: use the direct URL for migrations; the pooled URL is used at runtime.
  datasource: { url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@localhost:5432/caring_chemistry" },
});
