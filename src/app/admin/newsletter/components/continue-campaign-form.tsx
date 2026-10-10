"use client";

import { useActionState } from "react";
import { continueCampaign, type NewsletterActionState } from "../actions";

const initialState: NewsletterActionState = {};

/** "Continue sending now" for a paused campaign, "Retry sending" for a failed one. */
export function ContinueCampaignForm({ id, retry }: { id: string; retry: boolean }) {
  const [state, action, pending] = useActionState(continueCampaign, initialState);
  return (
    <form action={action} className="mt-2">
      <input name="id" type="hidden" value={id} />
      <button className="text-sm font-semibold text-accent-700 hover:text-accent-900 disabled:opacity-60" disabled={pending} type="submit">
        {pending ? "Starting…" : retry ? "Retry sending" : "Continue sending now"}
      </button>
      {state.error && <p className="mt-2 text-xs text-red-700" role="alert">{state.error}</p>}
    </form>
  );
}
