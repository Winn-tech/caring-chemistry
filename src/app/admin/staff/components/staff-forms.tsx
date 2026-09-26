"use client";

import { useActionState } from "react";
import { Role } from "@/generated/prisma/enums";
import { createStaff, deleteStaff, resendStaffInvitation, updateStaff, updateStaffStatus, type StaffActionState } from "../actions";

const initialState: StaffActionState = {};

export function CreateStaffForm() {
  const [state, action, pending] = useActionState(createStaff, initialState);
  return (
    <form action={action} className="mt-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-primary-800">Full name<input className="input mt-2" name="name" required minLength={2} maxLength={100} /></label>
        <label className="text-sm font-medium text-primary-800">Work email<input className="input mt-2" name="email" type="email" autoComplete="email" required /></label>
        <label className="text-sm font-medium text-primary-800">Workspace<select className="input mt-2" name="role" defaultValue={Role.SALES_TEAM}><option value={Role.SALES_TEAM}>Sales and orders</option><option value={Role.SOCIAL_TEAM}>Journal and announcements</option></select></label>
      </div>
      {state.error && <p className="text-sm text-red-700" role="alert">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald-700" role="status">{state.success}</p>}
      <button className="rounded-lg bg-primary-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={pending} type="submit">{pending ? "Sending invitation..." : "Create account"}</button>
    </form>
  );
}

export function StaffStatusForm({ id, isActive }: { id: string; isActive: boolean }) {
  const [state, action, pending] = useActionState(updateStaffStatus, initialState);
  return <form action={action} className="flex items-center justify-end gap-3"><input name="id" type="hidden" value={id} /><input name="isActive" type="hidden" value={String(!isActive)} /><button className={`text-sm font-semibold ${isActive ? "text-red-700 hover:text-red-900" : "text-emerald-700 hover:text-emerald-900"}`} disabled={pending} type="submit">{pending ? "Saving..." : isActive ? "Deactivate" : "Reactivate"}</button>{state.error && <span className="sr-only" role="alert">{state.error}</span>}{state.success && <span className="sr-only" role="status">{state.success}</span>}</form>;
}

export function StaffEditForm({ id, name, email, role }: { id: string; name: string; email: string; role: Role }) {
  const [state, action, pending] = useActionState(updateStaff, initialState);
  return <form action={action} className="space-y-2"><input name="id" type="hidden" value={id} /><input className="input" name="name" defaultValue={name} required minLength={2} maxLength={100} /><input className="input" name="email" type="email" defaultValue={email} required /><select className="input" name="role" defaultValue={role}><option value={Role.SALES_TEAM}>Sales and orders</option><option value={Role.SOCIAL_TEAM}>Journal and announcements</option></select><button className="text-sm font-semibold text-primary-700 hover:text-primary-950" disabled={pending} type="submit">{pending ? "Saving..." : "Save changes"}</button>{state.error && <span className="block text-xs text-red-700" role="alert">{state.error}</span>}</form>;
}

export function StaffDeleteForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(deleteStaff, initialState);
  return <form action={action}><input name="id" type="hidden" value={id} /><button className="text-sm font-semibold text-red-700 hover:text-red-900" disabled={pending} type="submit">{pending ? "Deleting..." : "Delete"}</button>{state.error && <span className="sr-only" role="alert">{state.error}</span>}</form>;
}

export function ResendInvitationForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(resendStaffInvitation, initialState);
  return <form action={action}><input name="id" type="hidden" value={id} /><button className="text-sm font-semibold text-accent-700 hover:text-accent-900" disabled={pending} type="submit">{pending ? "Sending..." : "Resend invitation"}</button>{state.error && <span className="sr-only" role="alert">{state.error}</span>}</form>;
}