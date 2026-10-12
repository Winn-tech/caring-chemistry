"use server";

import { cookies } from "next/headers";
import { adminSessionCookie, requireAdminPage, signToken } from "@/lib/auth";
import { changeAdminPassword, passwordChangeSchema } from "@/lib/password-change";

export type ChangePasswordState = { error?: string; success?: string };

export async function changePassword(_: ChangePasswordState, formData: FormData): Promise<ChangePasswordState> {
  // Any signed-in admin role may change their own password; only their own account is touched.
  const user = await requireAdminPage();

  const parsed = passwordChangeSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the passwords you entered." };

  const result = await changeAdminPassword(user.id, parsed.data);
  if (!result.ok) return { error: result.error };

  // The change ended every earlier session, including this one; issue a fresh one for this browser.
  // It is signed after the password was saved, so it remains valid.
  (await cookies()).set(adminSessionCookie(await signToken(user)));
  return { success: "Your password has been changed. Any other devices signed in to your account have been signed out." };
}
