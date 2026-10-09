"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { Role } from "@/generated/prisma/enums";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { auditServer } from "@/lib/security";
import { coordinatesFromMapsLink, isValidTime, STORE_DAYS, type OpeningHours } from "@/lib/store-details";
import { z } from "zod";

export type StoreFormState = { error?: string };

const optionalText = (max: number) => z.preprocess((value) => typeof value === "string" && value.trim() ? value.trim() : undefined, z.string().max(max).optional());
const schema = z.object({
  name: z.string().trim().min(2, "Enter the store name.").max(160),
  address: z.string().trim().min(2, "Enter the street address.").max(300),
  city: optionalText(100),
  state: optionalText(100),
  country: z.string().trim().min(2, "Enter the country.").max(100),
  phone: optionalText(40),
  email: z.preprocess((value) => typeof value === "string" && value.trim() ? value.trim() : undefined, z.string().email("Enter a valid email address.").max(254).optional()),
  mapLink: optionalText(2_000),
  isActive: z.boolean(),
});

function read(formData: FormData) {
  return schema.safeParse({
    name: formData.get("name"), address: formData.get("address"), city: formData.get("city"), state: formData.get("state"),
    country: formData.get("country"), phone: formData.get("phone"), email: formData.get("email"), mapLink: formData.get("mapLink"),
    isActive: formData.get("isActive") === "on",
  });
}

function idFrom(formData: FormData) {
  const id = formData.get("id");
  return typeof id === "string" && z.string().cuid().safeParse(id).success ? id : null;
}

/**
 * Reads the weekly grid: per day an open time, a close time and a "closed" tick box.
 * A day with neither time nor tick is simply not listed.
 */
function readOpeningHours(formData: FormData): { hours: OpeningHours } | { error: string } {
  const hours: OpeningHours = {};
  for (const day of STORE_DAYS) {
    const open = String(formData.get(`hours.${day.key}.open`) ?? "").trim();
    const close = String(formData.get(`hours.${day.key}.close`) ?? "").trim();
    if (formData.get(`hours.${day.key}.closed`) === "on") {
      hours[day.key] = "closed";
      continue;
    }
    if (!open && !close) continue;
    if (!open || !close) return { error: `${day.label}: enter both an opening and a closing time, or tick "Closed".` };
    if (!isValidTime(open) || !isValidTime(close)) return { error: `${day.label}: use valid times.` };
    if (close <= open) return { error: `${day.label}: the closing time must be later than the opening time.` };
    hours[day.key] = `${open}-${close}`;
  }
  return { hours };
}

function revalidateStorePaths() {
  revalidatePath("/admin/stores");
  revalidatePath("/stores");
  revalidatePath("/product", "layout");
}

export async function saveStore(_state: StoreFormState, formData: FormData): Promise<StoreFormState> {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SALES_TEAM]);
  const parsed = read(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please review the store details." };

  const openingHours = readOpeningHours(formData);
  if ("error" in openingHours) return { error: openingHours.error };

  let coordinates: { latitude: number; longitude: number } | null = null;
  if (parsed.data.mapLink) {
    coordinates = coordinatesFromMapsLink(parsed.data.mapLink);
    if (!coordinates) return { error: "We couldn't read a location from that Google Maps link. Open the place in Google Maps on a computer and copy the full link from the address bar (short maps.app.goo.gl links don't include the location), or leave the field empty." };
  }

  const details = parsed.data;
  // Empty fields are saved as empty, so hours and map location can be cleared as well as set.
  const data = {
    name: details.name,
    address: details.address,
    country: details.country,
    isActive: details.isActive,
    city: details.city ?? null,
    state: details.state ?? null,
    phone: details.phone ?? null,
    email: details.email ?? null,
    latitude: coordinates?.latitude ?? null,
    longitude: coordinates?.longitude ?? null,
    openingHours: Object.keys(openingHours.hours).length ? openingHours.hours : Prisma.DbNull,
  };

  const id = idFrom(formData);
  try {
    const store = id ? await prisma.store.update({ where: { id }, data }) : await prisma.store.create({ data });
    await auditServer(user.id, id ? "STORE_UPDATED" : "STORE_CREATED", "Store", store.id, { name: store.name, isActive: store.isActive });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") return { error: "This store no longer exists." };
    throw error;
  }

  revalidateStorePaths();
  redirect("/admin/stores");
}

export async function toggleStore(formData: FormData) {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SALES_TEAM]);
  const id = idFrom(formData);
  if (!id) return;
  const store = await prisma.store.findUnique({ where: { id }, select: { isActive: true, name: true } });
  if (!store) return;
  await prisma.store.update({ where: { id }, data: { isActive: !store.isActive } });
  await auditServer(user.id, store.isActive ? "STORE_DEACTIVATED" : "STORE_ACTIVATED", "Store", id, { name: store.name });
  revalidateStorePaths();
}
