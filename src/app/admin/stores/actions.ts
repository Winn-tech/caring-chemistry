"use server";

import { revalidatePath } from "next/cache";
import { Role } from "@/generated/prisma/enums";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { auditServer } from "@/lib/security";
import { z } from "zod";

export type StoreFormState = { error?: string; success?: string };
const optionalText = (max: number) => z.preprocess((value) => typeof value === "string" && value.trim() ? value.trim() : undefined, z.string().max(max).optional());
const schema = z.object({ name: z.string().trim().min(2).max(160), address: z.string().trim().min(2).max(300), city: optionalText(100), state: optionalText(100), country: z.string().trim().min(2).max(100), phone: optionalText(40), email: z.preprocess((value) => typeof value === "string" && value.trim() ? value.trim() : undefined, z.string().email().max(254).optional()), latitude: z.preprocess((value) => value === "" ? undefined : value, z.coerce.number().min(-90).max(90).optional()), longitude: z.preprocess((value) => value === "" ? undefined : value, z.coerce.number().min(-180).max(180).optional()), openingHours: optionalText(2_000), isActive: z.boolean() });
const openingHoursSchema = z.record(z.string().min(1).max(20), z.string().max(100)).refine((value) => Object.keys(value).length <= 14, "Opening hours contain too many entries.");
function read(formData: FormData) { return schema.safeParse({ name: formData.get("name"), address: formData.get("address"), city: formData.get("city"), state: formData.get("state"), country: formData.get("country"), phone: formData.get("phone"), email: formData.get("email"), latitude: formData.get("latitude"), longitude: formData.get("longitude"), openingHours: formData.get("openingHours"), isActive: formData.get("isActive") === "on" }); }
function idFrom(formData: FormData) { const id = formData.get("id"); return typeof id === "string" && z.string().cuid().safeParse(id).success ? id : null; }
export async function saveStore(_state: StoreFormState, formData: FormData): Promise<StoreFormState> {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SALES_TEAM]);
  const parsed = read(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please review the store details." };
  const id = idFrom(formData);
  let parsedOpeningHours: z.infer<typeof openingHoursSchema> | undefined;
  if (parsed.data.openingHours) {
    let json: unknown;
    try { json = JSON.parse(parsed.data.openingHours); } catch { return { error: "Opening hours must be valid JSON." }; }
    const openingHoursResult = openingHoursSchema.safeParse(json);
    if (!openingHoursResult.success) return { error: openingHoursResult.error.issues[0]?.message ?? "Opening hours must be a simple day-to-hours object." };
    parsedOpeningHours = openingHoursResult.data;
  }
  const data = { ...parsed.data };
  delete data.openingHours;
  const store = id ? await prisma.store.update({ where: { id }, data: { ...data, openingHours: parsedOpeningHours } }) : await prisma.store.create({ data: { ...data, openingHours: parsedOpeningHours } });
  await auditServer(user.id, id ? "STORE_UPDATED" : "STORE_CREATED", "Store", store.id, { name: store.name, isActive: store.isActive });
  revalidatePath("/admin/stores"); revalidatePath("/stores"); revalidatePath("/product", "layout");
  return { success: id ? "Store updated." : "Store added." };
}
export async function toggleStore(formData: FormData) {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SALES_TEAM]);
  const id = idFrom(formData); if (!id) return;
  const store = await prisma.store.findUnique({ where: { id }, select: { isActive: true, name: true } }); if (!store) return;
  await prisma.store.update({ where: { id }, data: { isActive: !store.isActive } });
  await auditServer(user.id, store.isActive ? "STORE_DEACTIVATED" : "STORE_ACTIVATED", "Store", id, { name: store.name });
  revalidatePath("/admin/stores"); revalidatePath("/stores"); revalidatePath("/product", "layout");
}
