"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { unsubscribeByToken } from "@/lib/newsletter";

export async function confirmUnsubscribe(formData: FormData) {
  const token = z.string().min(20).max(200).safeParse(formData.get("token"));
  if (!token.success) redirect("/");
  const unsubscribed = await unsubscribeByToken(token.data);
  redirect(`/newsletter/unsubscribe/${encodeURIComponent(token.data)}?status=${unsubscribed ? "done" : "invalid"}`);
}
