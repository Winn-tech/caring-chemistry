import bcrypt from "bcryptjs";
import { Role } from "@/generated/prisma/client";
import { z } from "zod";
import { errorResponse, ok, ApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { audit } from "@/lib/security";
const schema = z.object({ name: z.string().min(2).max(100), email: z.string().email(), password: z.string().min(12).max(128), role: z.enum([Role.GENERAL_ADMIN, Role.SALES_TEAM, Role.SOCIAL_TEAM]) });
export async function GET(request: Request) { try { await requireRole(request, [Role.GENERAL_ADMIN]); return ok(await prisma.user.findMany({ where: { role: { not: Role.CUSTOMER } }, select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true }, orderBy: { createdAt: "desc" } })); } catch (error) { return errorResponse(error); } }
export async function POST(request: Request) { try { const actor = await requireRole(request, [Role.GENERAL_ADMIN]); const input = schema.parse(await request.json()); if (input.role === Role.GENERAL_ADMIN && actor.role !== Role.GENERAL_ADMIN) throw new ApiError(403, "Not permitted."); const user = await prisma.user.create({ data: { ...input, email: input.email.toLowerCase(), passwordHash: await bcrypt.hash(input.password, 12) } }); await audit(actor.id, "STAFF_CREATED", "User", user.id, request, { role: user.role }); return ok({ id: user.id, name: user.name, email: user.email, role: user.role, isActive: user.isActive }, 201); } catch (error) { return errorResponse(error); } }
