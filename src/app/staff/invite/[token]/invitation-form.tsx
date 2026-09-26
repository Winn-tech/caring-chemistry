"use client";

import { useActionState } from "react";
import { acceptInvitation, type InvitationActionState } from "./actions";

const initialState: InvitationActionState = {};

export function InvitationForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(acceptInvitation, initialState);
  return <form action={action} className="mt-8 space-y-5"><input name="token" type="hidden" value={token} /><label className="block text-sm font-medium text-primary-800">Password<input className="input mt-2" name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required /><span className="mt-1 block text-xs font-normal text-primary-500">Use at least 12 characters.</span></label><label className="block text-sm font-medium text-primary-800">Confirm password<input className="input mt-2" name="confirmPassword" type="password" autoComplete="new-password" minLength={12} maxLength={128} required /></label>{state.error && <p className="text-sm text-red-700" role="alert">{state.error}</p>}{state.success ? <p className="text-sm text-emerald-700" role="status">Your account is active. You can now sign in at the admin login page.</p> : <button className="w-full rounded-lg bg-primary-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:opacity-60" disabled={pending} type="submit">{pending ? "Activating account..." : "Activate account"}</button>}</form>;
}
