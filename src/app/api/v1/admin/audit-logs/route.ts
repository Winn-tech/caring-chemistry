import { Role } from "@/generated/prisma/client";
import { errorResponse, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await requireRole(request, [Role.GENERAL_ADMIN]);
    const limit = Math.min(Math.max(Number(new URL(request.url).searchParams.get("limit") ?? 50), 1), 100);
    const logs = await prisma.auditLog.findMany({
      take: Number.isFinite(limit) ? limit : 50,
      include: { actor: { select: { id: true, name: true, email: true, role: true } } },
      orderBy: { createdAt: "desc" },
    });
    return ok(logs);
  } catch (error) { return errorResponse(error); }
}
