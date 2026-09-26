import { Role } from "@/generated/prisma/client";
import { z } from "zod";
import { errorResponse, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { audit } from "@/lib/security";
const schema = z.object({ name: z.string().min(2).max(80), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) });
export async function GET(request: Request) { try { await requireRole(request, [Role.GENERAL_ADMIN, Role.SALES_TEAM]); return ok(await prisma.category.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { products: true } } } })); } catch (error) { return errorResponse(error); } }
export async function POST(request: Request) { try { const user = await requireRole(request, [Role.GENERAL_ADMIN, Role.SALES_TEAM]); const category = await prisma.category.create({ data: schema.parse(await request.json()) }); await audit(user.id, "CATEGORY_CREATED", "Category", category.id, request); return ok(category, 201); } catch (error) { return errorResponse(error); } }
