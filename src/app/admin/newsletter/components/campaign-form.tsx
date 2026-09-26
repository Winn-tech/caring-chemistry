"use client";

import { useActionState } from "react";
import { createCampaign, type NewsletterActionState } from "../actions";

const initialState: NewsletterActionState = {};

export function CampaignForm() {
  const [state, action, pending] = useActionState(createCampaign, initialState);
  return <form action={action} className="space-y-5 rounded-xl border border-primary-100 bg-white p-5 sm:p-6"><div><label className="text-sm font-medium text-primary-800" htmlFor="campaign-subject">Subject</label><input className="input mt-2" id="campaign-subject" maxLength={180} name="subject" required /></div><div><label className="text-sm font-medium text-primary-800" htmlFor="campaign-content">Content</label><textarea className="input mt-2 min-h-56 leading-relaxed" id="campaign-content" name="content" placeholder="Write one paragraph per line..." required /></div>{state.error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{state.error}</p>}<button className="rounded-lg bg-primary-950 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-800 disabled:opacity-60" disabled={pending} type="submit">{pending ? "Saving..." : "Save campaign draft"}</button></form>;
}
