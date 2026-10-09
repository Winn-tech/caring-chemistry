import Link from "next/link";
import { Role } from "@/generated/prisma/enums";
import { requireAdminPage } from "@/lib/auth";
import { AdminShell } from "../../components/admin-shell";
import { StoreForm } from "../components/store-form";

export const dynamic = "force-dynamic";

export default async function NewStorePage() {
  const user = await requireAdminPage([Role.GENERAL_ADMIN, Role.SALES_TEAM]);
  return (
    <AdminShell user={user}>
      <Link className="text-sm font-medium text-primary-600 hover:text-primary-950" href="/admin/stores">← Back to stores</Link>
      <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">Add store</h1>
      <p className="mt-2 text-sm text-primary-600">New stores appear on the public “Find a store” page as soon as they are saved as active.</p>
      <StoreForm />
    </AdminShell>
  );
}
