"use server";

import { revalidatePath } from "next/cache";
import { Role, RetailerType } from "@/generated/prisma/enums";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { auditServer } from "@/lib/security";
import { z } from "zod";

export type RetailerFormState = { error?: string; success?: string };
const optionalUrl = z.preprocess((value) => typeof value === "string" && value.trim() ? value.trim() : undefined, z.string().max(2_000).url().refine((value) => { try { const parsed = new URL(value); return ["http:", "https:"].includes(parsed.protocol) && !parsed.username && !parsed.password; } catch { return false; } }, "Use a valid http or https URL without credentials.").optional());
const schema = z.object({ name: z.string().trim().min(2).max(120), country: z.preprocess((value) => typeof value === "string" && value.trim() ? value.trim() : undefined, z.string().max(80).optional()), websiteUrl: optionalUrl, priority: z.coerce.number().int().min(0).max(1_000_000), isActive: z.boolean() });

function read(formData: FormData) { return schema.safeParse({ name: formData.get("name"), country: formData.get("country"), websiteUrl: formData.get("websiteUrl"), priority: formData.get("priority"), isActive: formData.get("isActive") === "on" }); }
function idFrom(formData: FormData) { const id = formData.get("id"); return typeof id === "string" && z.string().cuid().safeParse(id).success ? id : null; }

export async function saveRetailer(_: RetailerFormState, formData: FormData): Promise<RetailerFormState> {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SALES_TEAM]);
  const parsed = read(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please review the retailer details." };
  const id = idFrom(formData);
  try {
    const retailer = id ? await prisma.retailer.update({ where: { id }, data: { ...parsed.data, type: RetailerType.ONLINE } }) : await prisma.retailer.create({ data: { ...parsed.data, type: RetailerType.ONLINE } });
    await auditServer(user.id, id ? "RETAILER_UPDATED" : "RETAILER_CREATED", "Retailer", retailer.id, { name: retailer.name, isActive: retailer.isActive });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") return { error: "That retailer no longer exists." };
    throw error;
  }
  revalidatePath("/admin/retailers");
  revalidatePath("/admin/products", "layout");
  return { success: id ? "Retailer updated." : "Retailer created." };
}

export async function toggleRetailer(formData: FormData) {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SALES_TEAM]);
  const id = idFrom(formData);
  if (!id) return;
  const retailer = await prisma.retailer.findUnique({ where: { id }, select: { isActive: true, name: true } });
  if (!retailer) return;
  await prisma.retailer.update({ where: { id }, data: { isActive: !retailer.isActive } });
  await auditServer(user.id, retailer.isActive ? "RETAILER_DEACTIVATED" : "RETAILER_ACTIVATED", "Retailer", id, { name: retailer.name });
  revalidatePath("/admin/retailers");
  revalidatePath("/product", "layout");
}
