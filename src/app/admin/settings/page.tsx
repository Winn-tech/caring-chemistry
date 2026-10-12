import { Role } from "@/generated/prisma/enums";
import { requireAdminPage } from "@/lib/auth";
import { MIN_PASSWORD_LENGTH } from "@/lib/password-change";
import { AdminShell } from "../components/admin-shell";
import { ChangePasswordForm } from "./components/change-password-form";

export const dynamic = "force-dynamic";

const ROLE_LABEL: Record<Role, string> = {
  GENERAL_ADMIN: "Main admin",
  SALES_TEAM: "Sales admin",
  SOCIAL_TEAM: "Blog admin",
  CUSTOMER: "Customer",
};

export default async function SettingsPage() {
  // Every admin role can open their own settings.
  const user = await requireAdminPage();

  return (
    <AdminShell user={user}>
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">Account</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-2 text-sm text-primary-600">Manage your own admin account.</p>
      </header>

      <div className="mt-8 grid max-w-4xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="h-fit rounded-xl border border-primary-100 bg-white p-5 sm:p-6">
          <h2 className="font-display text-xl font-semibold">Your account</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-primary-500">Name</dt><dd className="mt-0.5 text-primary-950">{user.name}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-primary-500">Email</dt><dd className="mt-0.5 break-all text-primary-950">{user.email}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-primary-500">Role</dt><dd className="mt-0.5 text-primary-950">{ROLE_LABEL[user.role]}</dd></div>
          </dl>
          <p className="mt-5 text-xs leading-relaxed text-primary-500">To change your name, email or role, ask a main admin to update your account under Admin users.</p>
        </section>

        <section className="rounded-xl border border-primary-100 bg-white p-5 sm:p-6">
          <h2 className="font-display text-xl font-semibold">Change password</h2>
          <p className="mt-2 text-sm leading-relaxed text-primary-600">For your security, changing your password signs you out on every other device. You stay signed in here.</p>
          <div className="mt-5">
            <ChangePasswordForm minLength={MIN_PASSWORD_LENGTH} />
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
