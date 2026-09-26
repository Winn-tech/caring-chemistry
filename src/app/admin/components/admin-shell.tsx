"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Boxes, ClipboardList, FileText, LayoutDashboard, Mail, MapPin, Megaphone, Settings, ShieldCheck, ShoppingBag, Users, type LucideIcon } from "lucide-react";
import { Role } from "@/generated/prisma/enums";

type AdminShellProps = { user: { name: string; email: string; role: Role }; children: React.ReactNode };

const roleLabel: Record<Role, string> = {
  GENERAL_ADMIN: "Main admin",
  SALES_TEAM: "Sales admin",
  SOCIAL_TEAM: "Blog admin",
  CUSTOMER: "Customer",
};

const items: Array<{ href: string; label: string; icon: LucideIcon; roles: readonly Role[] }> = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard, roles: ["GENERAL_ADMIN", "SALES_TEAM", "SOCIAL_TEAM"] },
  { href: "/admin/products", label: "Products", icon: Boxes, roles: ["GENERAL_ADMIN", "SALES_TEAM"] },
  { href: "/admin/categories", label: "Categories", icon: Boxes, roles: ["GENERAL_ADMIN", "SALES_TEAM"] },
  { href: "/admin/retailers", label: "Retailers", icon: ShoppingBag, roles: ["GENERAL_ADMIN", "SALES_TEAM"] },
  { href: "/admin/stores", label: "Stores", icon: MapPin, roles: ["GENERAL_ADMIN", "SALES_TEAM"] },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList, roles: ["GENERAL_ADMIN", "SALES_TEAM"] },
  { href: "/admin/invoices", label: "Invoices", icon: FileText, roles: ["GENERAL_ADMIN", "SALES_TEAM"] },
  { href: "/admin/journal", label: "Journal", icon: BookOpen, roles: ["GENERAL_ADMIN", "SOCIAL_TEAM"] },
  { href: "/admin/announcement", label: "Announcement", icon: Megaphone, roles: ["GENERAL_ADMIN", "SOCIAL_TEAM"] },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail, roles: ["GENERAL_ADMIN"] },
  { href: "/admin/staff", label: "Admin users", icon: Users, roles: ["GENERAL_ADMIN"] },
  { href: "/admin/settings", label: "Settings", icon: Settings, roles: ["GENERAL_ADMIN"] },
];

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const links = items.filter((item) => item.roles.includes(user.role));

  async function signOut() {
    await fetch("/admin/logout", { method: "POST", credentials: "same-origin" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#f7f3ef] text-primary-950 lg:grid lg:h-screen lg:grid-cols-[16rem_1fr] lg:overflow-hidden">
      <aside className="admin-sidebar border-b border-primary-100 bg-white px-5 py-5 lg:h-screen lg:overflow-hidden lg:border-b-0 lg:border-r lg:px-6 lg:py-7">
        <div className="flex items-center justify-between lg:block">
          <Link className="font-display text-xl font-semibold tracking-tight" href="/admin/dashboard">Caring Chemistry</Link>
          <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-semibold text-accent-800 lg:hidden">Admin</span>
        </div>
        <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-10 lg:flex-col" aria-label="Admin navigation">
          {links.map(({ href, label, icon: Icon }, index) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return <Link key={href} href={href} className={`admin-nav-item inline-flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${active ? "bg-primary-950 text-white" : "text-primary-700 hover:bg-primary-50"}`} style={{ "--admin-nav-delay": `${index * 55}ms` } as React.CSSProperties}><Icon size={17} />{label}</Link>;
          })}
        </nav>
        <div className="mt-5 hidden border-t border-primary-100 pt-5 lg:block">
          <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-800"><ShieldCheck size={18} /></span><div className="min-w-0"><p className="truncate text-sm font-semibold">{user.name}</p><p className="truncate text-xs text-primary-500">{roleLabel[user.role]}</p></div></div>
          <button className="mt-5 text-sm font-medium text-primary-600 hover:text-primary-950" onClick={signOut} type="button">Sign out</button>
        </div>
      </aside>
      <section className="min-w-0 px-6 py-8 lg:h-screen lg:overflow-y-auto lg:px-10 lg:py-10"><div key={pathname} className="admin-page-enter">{children}</div></section>
    </main>
  );
}
