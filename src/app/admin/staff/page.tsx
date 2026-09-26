import { Role } from "@/generated/prisma/client";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "../components/admin-shell";
import { CreateStaffForm, ResendInvitationForm, StaffDeleteForm, StaffEditForm, StaffStatusForm } from "./components/staff-forms";

export const dynamic = "force-dynamic";

const roleLabels: Record<string, string> = { SALES_TEAM: "Sales and orders", SOCIAL_TEAM: "Journal and announcements" };
const dateFormatter = new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" });

export default async function StaffPage() {
  const user = await requireAdminPage([Role.GENERAL_ADMIN]);
  const staff = await prisma.user.findMany({
    where: { role: { in: [Role.SALES_TEAM, Role.SOCIAL_TEAM] } },
    select: { id: true, name: true, email: true, role: true, isActive: true, invitationAcceptedAt: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

    return <AdminShell user={user}>
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">Access control</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Admin users</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary-600">Create focused accounts for store operations and content. Main admin access stays protected.</p>
      </header>
      <section className="mt-8 rounded-xl border border-primary-100 bg-white p-5 sm:p-6">
        <div>
          <h2 className="font-display text-xl font-semibold">Add a team member</h2>
          <p className="mt-1 text-sm text-primary-600">The team member will receive a one-time invitation to set their password.</p>
        </div>
        <CreateStaffForm />
      </section>
      <section className="mt-8 overflow-hidden rounded-xl border border-primary-100 bg-white">
        <div className="border-b border-primary-100 px-5 py-4">
          <h2 className="font-display text-xl font-semibold">Team access</h2>
          <p className="mt-1 text-sm text-primary-600">{staff.length} staff account{staff.length === 1 ? "" : "s"}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-primary-100 bg-primary-50 text-xs uppercase tracking-wide text-primary-600">
              <tr>
                <th className="px-5 py-4 font-semibold">Person</th>
                <th className="px-5 py-4 font-semibold">Workspace</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Joined</th>
                <th className="px-5 py-4"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100">
              {staff.map((member) => {
                const pending = !member.invitationAcceptedAt;
                return (
                  <tr key={member.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-primary-950">{member.name}</p>
                      <p className="mt-1 text-xs text-primary-500">{member.email}</p>
                    </td>
                    <td className="px-5 py-4 text-primary-700">{roleLabels[member.role]}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${pending ? "bg-amber-50 text-amber-700" : member.isActive ? "bg-emerald-50 text-emerald-700" : "bg-primary-100 text-primary-600"}`}>
                        {pending ? "Pending invitation" : member.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-primary-600">{dateFormatter.format(member.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center justify-end gap-3">
                        <StaffEditForm id={member.id} name={member.name} email={member.email} role={member.role} />
                        {pending && <ResendInvitationForm id={member.id} />}
                        <StaffStatusForm id={member.id} isActive={member.isActive} />
                        <StaffDeleteForm id={member.id} />
                      </div>
                    </td>
                    </tr>
                  );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>;
}