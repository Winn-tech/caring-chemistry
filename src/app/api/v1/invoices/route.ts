import { Role } from "@/generated/prisma/client";
import { errorResponse, ok } from "@/lib/api";
import { requireRole } from "@/lib/auth";
import { issueInvoiceForPaidOrder } from "@/lib/invoices";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/security";
import { z } from "zod";

export async function GET(request: Request) {
  try {
    await requireRole(request, [Role.GENERAL_ADMIN, Role.SALES_TEAM]);
    const invoices = await prisma.invoice.findMany({
      include: { order: { select: { reference: true } }, creditNotes: true },
      orderBy: { issuedAt: "desc" },
    });
    return ok(invoices);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireRole(request, [Role.GENERAL_ADMIN, Role.SALES_TEAM]);
    const { orderId } = z.object({ orderId: z.string().cuid() }).parse(await request.json());
    const { invoice, created } = await issueInvoiceForPaidOrder(orderId);
    if (created) await audit(user.id, "INVOICE_ISSUED", "Invoice", invoice.id, request, { orderId, number: invoice.number });
    return ok({ invoice, created }, created ? 201 : 200);
  } catch (error) {
    return errorResponse(error);
  }
}
