"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { auditServer } from "@/lib/security";
import { MESSAGE_ROLES } from "./roles";

function idFrom(formData: FormData) {
  const id = formData.get("id");
  return typeof id === "string" && z.string().cuid().safeParse(id).success ? id : null;
}

export async function setMessageRead(formData: FormData) {
  await requireAdminPage(MESSAGE_ROLES);
  const id = idFrom(formData);
  if (!id) return;
  // updateMany so a message deleted by someone else in the meantime is simply skipped.
  await prisma.contactMessage.updateMany({ where: { id }, data: { isRead: formData.get("read") === "true" } });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(formData: FormData) {
  const user = await requireAdminPage(MESSAGE_ROLES);
  const id = idFrom(formData);
  if (!id) return;
  const message = await prisma.contactMessage.findUnique({ where: { id }, select: { email: true, topic: true } });
  if (!message) return;
  await prisma.contactMessage.delete({ where: { id } });
  await auditServer(user.id, "CONTACT_MESSAGE_DELETED", "ContactMessage", id, { email: message.email, topic: message.topic });
  revalidatePath("/admin/messages");
}
