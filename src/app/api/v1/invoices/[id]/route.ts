import { Role } from "@/generated/prisma/client";
import { ApiError, errorResponse, ok } from "@/lib/api";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(request, [Role.GENERAL_ADMIN, Role.SALES_TEAM]);
    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({ where: { id }, include: { order: { select: { reference: true } }, creditNotes: true } });
    if (!invoice) throw new ApiError(404, "Invoice not found.");
    return ok(invoice);
  } catch (error) {
    return errorResponse(error);
  }
}
