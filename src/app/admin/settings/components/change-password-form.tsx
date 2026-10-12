"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { changePassword, type ChangePasswordState } from "../actions";

const initialState: ChangePasswordState = {};

export function ChangePasswordForm({ minLength }: { minLength: number }) {
  const [state, action, pending] = useActionState(changePassword, initialState);

  return (
    <form action={action} className="space-y-5">
      <PasswordField id="currentPassword" label="Current password" autoComplete="current-password" />
      <PasswordField id="newPassword" label="New password" autoComplete="new-password" minLength={minLength} hint={`At least ${minLength} characters. A short phrase of several words is easy to remember and hard to guess.`} />
      <PasswordField id="confirmPassword" label="Confirm new password" autoComplete="new-password" minLength={minLength} />

      {state.error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{state.error}</p>}
      {state.success && <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">{state.success}</p>}

      <button className="rounded-lg bg-primary-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={pending} type="submit">
        {pending ? "Changing password…" : "Change password"}
      </button>
    </form>
  );
}

function PasswordField({ id, label, autoComplete, minLength, hint }: { id: string; label: string; autoComplete: string; minLength?: number; hint?: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label className="text-sm font-medium text-primary-800" htmlFor={id}>{label}</label>
      <div className="relative mt-2">
        <input
          className="w-full rounded-lg border border-primary-200 py-3 pl-3.5 pr-11 text-sm outline-none transition focus:border-accent-600 focus:ring-2 focus:ring-accent-100"
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          minLength={minLength}
          maxLength={128}
          required
          aria-describedby={hint ? `${id}-hint` : undefined}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
          aria-controls={id}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-primary-500 outline-none transition-colors hover:text-primary-900 focus-visible:ring-2 focus-visible:ring-accent-100"
        >
          {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </div>
      {hint && <p id={`${id}-hint`} className="mt-1.5 text-xs text-primary-500">{hint}</p>}
    </div>
  );
}
