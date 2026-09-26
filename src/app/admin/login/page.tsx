import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminLoginForm } from "../components/admin-login-form";

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin/dashboard");

  return (
    <main className="min-h-screen bg-[#f7f3ef] px-6 py-10 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center justify-center">
        <section className="w-full max-w-md rounded-2xl border border-primary-100 bg-white p-7 shadow-[0_20px_60px_rgba(51,29,44,0.08)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-700">Caring Chemistry</p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-primary-950">Admin sign in</h1>
          <p className="mt-3 text-sm leading-relaxed text-primary-600">Use your assigned staff account to access store operations.</p>
          <AdminLoginForm />
        </section>
      </div>
    </main>
  );
}
