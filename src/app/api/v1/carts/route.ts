import { CartStatus, Role } from "@/generated/prisma/client";
import { errorResponse, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
export async function GET(request: Request) { try { await requireRole(request, [Role.GENERAL_ADMIN, Role.SALES_TEAM]); const raw = new URL(request.url).searchParams.get("status") as CartStatus | null; const status = raw ?? CartStatus.ABANDONED; return ok(await prisma.cart.findMany({ where: { status }, include: { items: { include: { product: { select: { id: true, name: true, price: true, currency: true } } } } }, orderBy: { updatedAt: "desc" } })); } catch (error) { return errorResponse(error); } }
