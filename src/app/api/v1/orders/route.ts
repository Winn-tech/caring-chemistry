import { OrderStatus, PaymentStatus, Role } from "@/generated/prisma/client";
import { errorResponse, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
export async function GET(request: Request) { try { await requireRole(request, [Role.GENERAL_ADMIN, Role.SALES_TEAM]); const query = new URL(request.url).searchParams; const status = query.get("status") as OrderStatus | null; const paymentStatus = query.get("paymentStatus") as PaymentStatus | null; return ok(await prisma.order.findMany({ where: { ...(status ? { status } : {}), ...(paymentStatus ? { paymentStatus } : {}) }, include: { items: true }, orderBy: { createdAt: "desc" } })); } catch (error) { return errorResponse(error); } }
