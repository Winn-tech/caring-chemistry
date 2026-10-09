import Link from "next/link";
import { notFound } from "next/navigation";
import { Role } from "@/generated/prisma/enums";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mapsLinkFromCoordinates, parseOpeningHours } from "@/lib/store-details";
import { AdminShell } from "../../components/admin-shell";
import { StoreForm, type StoreFormValue } from "../components/store-form";

export const dynamic = "force-dynamic";

export default async function EditStorePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SALES_TEAM]);
  const { id } = await params;
  const store = await prisma.store.findUnique({ where: { id } });
  if (!store) notFound();

  // Only plain values go to the client form (Prisma Decimal and Json are converted here).
  const value: StoreFormValue = {
    id: store.id,
    name: store.name,
    address: store.address,
    city: store.city,
    state: store.state,
    country: store.country,
    phone: store.phone,
    email: store.email,
    mapLink: mapsLinkFromCoordinates(store.latitude?.toString() ?? null, store.longitude?.toString() ?? null),
    isActive: store.isActive,
    openingHours: parseOpeningHours(store.openingHours),
  };

  return (
    <AdminShell user={user}>
      <Link className="text-sm font-medium text-primary-600 hover:text-primary-950" href="/admin/stores">← Back to stores</Link>
      <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">Edit store</h1>
      <p className="mt-2 text-sm text-primary-600">Changes appear on the public “Find a store” page straight away and are recorded in the audit log.</p>
      <StoreForm store={value} />
    </AdminShell>
  );
}
