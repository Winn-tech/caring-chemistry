import { OrderStatus } from "@/generated/prisma/enums";

/** Fulfilment steps staff may move an order through. Shared by the order page and its server action. */
const transitions: Partial<Record<OrderStatus, readonly OrderStatus[]>> = {
  [OrderStatus.PAID]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED, OrderStatus.REFUNDED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED, OrderStatus.REFUNDED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
};

export function allowedNextStatuses(status: OrderStatus): readonly OrderStatus[] {
  return transitions[status] ?? [];
}
