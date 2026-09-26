"use client";

import { useActionState } from "react";
import { createCategory, type CategoryFormState } from "../actions";

const initialState: CategoryFormState = {};

export function CategoryForm() {
  const [state, action, pending] = useActionState(createCategory, initialState);

  return (
    <form action={action} className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <label className="text-sm font-medium text-primary-800">Category name<input className="input mt-2" name="name" placeholder="Serums" required minLength={2} maxLength={80} /></label>
      <label className="text-sm font-medium text-primary-800">Slug<input className="input mt-2" name="slug" placeholder="serums" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required /></label>
      <button className="rounded-lg bg-primary-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={pending} type="submit">{pending ? "Adding..." : "Add category"}</button>
      {state.error && <p className="sm:col-span-3 text-sm text-red-700" role="alert">{state.error}</p>}
      {state.success && <p className="sm:col-span-3 text-sm text-emerald-700" role="status">{state.success}</p>}
    </form>
  );
}