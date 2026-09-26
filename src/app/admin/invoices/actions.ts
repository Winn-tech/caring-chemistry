"use server";

import { revalidatePath } from "next/cache";
import { Role } from "@/generated/prisma/enums";
import { requireAdminPage } from "@/lib/auth";
import { issueInvoiceForPaidOrder } from "@/lib/invoices";
import { auditServer } from "@/lib/security";
import { z } from "zod";

export type InvoiceActionState = { error?: string; success?: string; invoiceId?: string };

export async function issueInvoice(_: InvoiceActionState, formData: FormData): Promise<InvoiceActionState> {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SALES_TEAM]);
  const parsed = z.object({ orderId: z.string().cuid() }).safeParse({ orderId: formData.get("orderId") });
  if (!parsed.success) return { error: "Invalid order." };

  try {
    const { invoice, created } = await issueInvoiceForPaidOrder(parsed.data.orderId);
    if (created) {
      await auditServer(user.id, "INVOICE_ISSUED", "Invoice", invoice.id, { orderId: parsed.data.orderId, number: invoice.number });
    }
    revalidatePath("/admin/invoices");
    revalidatePath(`/admin/orders/${parsed.data.orderId}`);
    return { success: created ? `Invoice ${invoice.number} issued.` : `Invoice ${invoice.number} already exists.`, invoiceId: invoice.id };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to issue the invoice." };
  }
}
