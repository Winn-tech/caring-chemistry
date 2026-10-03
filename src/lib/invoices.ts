import { OrderStatus, PaymentStatus, Prisma } from "@/generated/prisma/client";
import { ApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

type InvoiceClient = Pick<typeof prisma, "$queryRaw" | "invoice" | "creditNote" | "order">;

type NumberRow = { number: number };
type OrderWithItems = Prisma.OrderGetPayload<{ include: { items: true } }>;

async function allocateDocumentNumber(client: InvoiceClient, prefix: "INV" | "CRN") {
  const rows = await client.$queryRaw<NumberRow[]>`
    INSERT INTO "InvoiceSequence" ("id", "nextNumber", "updatedAt")
    VALUES ('documents', 2, NOW())
    ON CONFLICT ("id") DO UPDATE
      SET "nextNumber" = "InvoiceSequence"."nextNumber" + 1,
          "updatedAt" = NOW()
    RETURNING "nextNumber" - 1 AS "number"
  `;
  const number = rows[0]?.number;
  if (!Number.isInteger(number) || number < 1) throw new Error("Unable to allocate a document number.");
  return `${prefix}-${new Date().getUTCFullYear()}-${String(number).padStart(6, "0")}`;
}

function createInvoiceSnapshot(order: OrderWithItems): Prisma.InputJsonValue {
  return {
    orderReference: order.reference,
    customerEmail: order.email,
    currency: "NGN",
    orderPlacedAt: order.createdAt.toISOString(),
    subtotal: order.subtotal.toString(),
    deliveryFee: order.deliveryFee.toString(),
    taxAmount: order.taxAmount.toString(),
    discountAmount: order.discountAmount.toString(),
    billingName: order.billingName,
    billingAddress: order.billingAddress as Prisma.InputJsonValue | null,
    total: order.total.toString(),
    items: order.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      unitPrice: item.unitPrice.toString(),
      quantity: item.quantity,
      lineTotal: (Number(item.unitPrice) * item.quantity).toFixed(2),
    })),
  };
}

/**
 * Issues exactly one immutable invoice for a successfully paid order.
 * This is idempotent so it is safe to call from a payment-provider webhook retry.
 */
export async function issueInvoiceForPaidOrder(orderId: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true, invoice: true },
    });
    if (!order) throw new ApiError(404, "Order not found.");
    if (order.invoice) return { invoice: order.invoice, created: false };
    if (order.paymentStatus !== PaymentStatus.PAID) {
      throw new ApiError(422, "Invoices can only be issued after payment has been confirmed.");
    }

    const invoice = await createInvoice(tx, order);
    return { invoice, created: true };
  });
}

async function createInvoice(
  client: InvoiceClient,
  order: OrderWithItems
) {
  const number = await allocateDocumentNumber(client, "INV");
  return client.invoice.create({
    data: {
      orderId: order.id,
      number,
      customerEmail: order.email,
      currency: "NGN",
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        taxAmount: order.taxAmount,
        discountAmount: order.discountAmount,
      total: order.total,
      snapshot: createInvoiceSnapshot(order),
    },
  });
}

/** Creates one full-refund credit note. It is deliberately idempotent. */
export async function issueCreditNoteForRefundedOrder(orderId: string, reason = "Order refunded") {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { invoice: { include: { creditNotes: true } } },
    });
    if (!order) throw new ApiError(404, "Order not found.");
    if (order.paymentStatus !== PaymentStatus.REFUNDED) {
      throw new ApiError(422, "A credit note can only be issued for a refunded payment.");
    }
    if (!order.invoice) {
      throw new ApiError(422, "Issue the original invoice before creating a credit note.");
    }
    const existing = order.invoice.creditNotes.find((note) => note.orderId === order.id);
    if (existing) return { creditNote: existing, created: false };

    const number = await allocateDocumentNumber(tx, "CRN");
    const creditNote = await tx.creditNote.create({
      data: {
        invoiceId: order.invoice.id,
        orderId: order.id,
        number,
        amount: order.total,
        currency: order.invoice.currency,
        reason,
      },
    });
    return { creditNote, created: true };
  });
}

/**
 * Applies the financial side of a full refund atomically: retain/issue the
 * original invoice, mark the payment and order refunded, then create the matching credit note.
 */
export async function refundOrderAndIssueCreditNote(orderId: string, reason = "Order refunded") {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true, invoice: { include: { creditNotes: true } } },
    });
    if (!order) throw new ApiError(404, "Order not found.");
    if (order.paymentStatus !== PaymentStatus.PAID) {
      throw new ApiError(422, "Only paid orders can be refunded.");
    }

    const invoice = order.invoice ?? await createInvoice(tx, order);
    await tx.order.update({
      where: { id: order.id },
      data: { paymentStatus: PaymentStatus.REFUNDED, status: OrderStatus.REFUNDED },
    });

    const existing = order.invoice?.creditNotes.find((note) => note.orderId === order.id);
    if (existing) return { invoice, creditNote: existing, created: false };
    const number = await allocateDocumentNumber(tx, "CRN");
    const creditNote = await tx.creditNote.create({
      data: { invoiceId: invoice.id, orderId: order.id, number, amount: order.total, currency: invoice.currency, reason },
    });
    return { invoice, creditNote, created: true };
  });
}
