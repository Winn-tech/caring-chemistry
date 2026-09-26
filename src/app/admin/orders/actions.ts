"use server";

import { revalidatePath } from "next/cache";
import { OrderStatus, PaymentStatus, Role } from "@/generated/prisma/enums";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { auditServer } from "@/lib/security";
import { refundOrderAndIssueCreditNote } from "@/lib/invoices";
import { z } from "zod";

export type OrderActionState = { error?: string; success?: string };

const transitions: Partial<Record<OrderStatus, readonly OrderStatus[]>> = {
  [OrderStatus.PAID]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED, OrderStatus.REFUNDED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED, OrderStatus.REFUNDED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
};

export async function updateOrderStatus(_: OrderActionState, formData: FormData): Promise<OrderActionState> {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SALES_TEAM]);
  const parsed = z.object({ id: z.string().cuid(), status: z.nativeEnum(OrderStatus) }).safeParse({ id: formData.get("id"), status: formData.get("status") });
  if (!parsed.success) return { error: "Invalid order update." };

  const order = await prisma.order.findUnique({ where: { id: parsed.data.id }, select: { id: true, status: true, paymentStatus: true } });
  if (!order) return { error: "Order not found." };
  if (user.role === Role.SALES_TEAM && order.paymentStatus !== PaymentStatus.PAID) return { error: "Sales staff can only update paid orders." };
  if (!transitions[order.status]?.includes(parsed.data.status)) return { error: "That status change is not permitted." };

  if (parsed.data.status === OrderStatus.REFUNDED) {
    const result = await refundOrderAndIssueCreditNote(order.id);
    await prisma.order.update({ where: { id: order.id }, data: { status: OrderStatus.REFUNDED } });
    await auditServer(user.id, "ORDER_REFUNDED", "Order", order.id, {
      from: order.status,
      creditNoteNumber: result.creditNote.number,
      invoiceNumber: result.invoice.number,
    });
  } else {
    await prisma.order.update({ where: { id: order.id }, data: { status: parsed.data.status } });
    await auditServer(user.id, "ORDER_STATUS_UPDATED", "Order", order.id, { from: order.status, to: parsed.data.status });
  }
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${order.id}`);
  return { success: "Order status updated." };
}

export function allowedNextStatuses(status: OrderStatus) { return transitions[status] ?? []; }
