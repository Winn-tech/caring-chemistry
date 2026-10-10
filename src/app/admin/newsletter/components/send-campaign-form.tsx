"use client";

import { useActionState } from "react";
import { sendCampaign, type NewsletterActionState } from "../actions";

const initialState: NewsletterActionState = {};

export function SendCampaignForm({ id, recipientCount, allowanceRemaining }: { id: string; recipientCount: number; allowanceRemaining: number }) {
  const [state, action, pending] = useActionState(sendCampaign, initialState);
  const overAllowance = recipientCount > allowanceRemaining;
  return (
    <form action={action} className="mt-3">
      <input name="id" type="hidden" value={id} />
      <button className="text-sm font-semibold text-accent-700 hover:text-accent-900 disabled:opacity-60" disabled={pending} type="submit">
        {pending ? "Sending..." : `Send to ${recipientCount} active subscribers`}
      </button>
      {overAllowance && (
        <p className="mt-1 text-xs text-primary-500">
          {allowanceRemaining > 0 ? `${allowanceRemaining} go out now;` : "None can go out right now;"} the rest are sent automatically as the daily allowance frees up. Nobody receives it twice.
        </p>
      )}
      {state.error && <p className="mt-2 text-xs text-red-700" role="alert">{state.error}</p>}
    </form>
  );
}
