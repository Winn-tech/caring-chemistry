import Link from "next/link";
import { Role } from "@/generated/prisma/enums";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasOpeningHours, parseOpeningHours } from "@/lib/store-details";
import { AdminShell } from "../components/admin-shell";
import { StoreList, type StoreListItem } from "./components/store-list";

export const dynamic = "force-dynamic";

export default async function StoresPage() {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SALES_TEAM]);
  const stores = await prisma.store.findMany({ orderBy: [{ state: "asc" }, { city: "asc" }, { name: "asc" }] });

  // Only plain values go to the client list (Prisma Decimal and Json are not passed through).
  const items: StoreListItem[] = stores.map((store) => ({
    id: store.id,
    name: store.name,
    address: store.address,
    city: store.city,
    state: store.state,
    country: store.country,
    phone: store.phone,
    hasHours: hasOpeningHours(parseOpeningHours(store.openingHours)),
    hasPin: store.latitude !== null && store.longitude !== null,
    isActive: store.isActive,
  }));
  const activeCount = items.filter((store) => store.isActive).length;
  const stateCount = new Set(items.map((store) => store.state).filter(Boolean)).size;

  return (
    <AdminShell user={user}>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">Purchasing</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Stores</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-primary-600">Physical locations shown on the public “Find a store” page. This list doesn&apos;t track product stock.</p>
        </div>
        <Link className="rounded-lg bg-primary-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800" href="/admin/stores/new">Add store</Link>
      </header>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <Metric label="Stores" value={items.length} />
        <Metric label="Active" value={activeCount} />
        <Metric label="States" value={stateCount} />
      </div>

      <StoreList stores={items} />
    </AdminShell>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-primary-100 bg-white p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-primary-950 sm:text-3xl">{value}</p>
    </div>
  );
}
