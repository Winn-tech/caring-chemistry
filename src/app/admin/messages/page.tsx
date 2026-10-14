import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "../components/admin-shell";
import { setMessageRead } from "./actions";
import { DeleteMessageButton } from "./components/delete-message-button";
import { MESSAGE_ROLES } from "./roles";

export const dynamic = "force-dynamic";

/** Newest messages shown at once; older ones stay saved and appear as newer ones are deleted. */
const PAGE_SIZE = 200;

const lagosTime = (date: Date) => date.toLocaleString("en-NG", { timeZone: "Africa/Lagos", dateStyle: "medium", timeStyle: "short" });
const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ show?: string }> }) {
  const user = await requireAdminPage(MESSAGE_ROLES);
  const unreadOnly = (await searchParams).show === "unread";

  const [total, unread, lastWeek, messages] = await Promise.all([
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.contactMessage.count({ where: { createdAt: { gte: daysAgo(7) } } }),
    prisma.contactMessage.findMany({ where: unreadOnly ? { isRead: false } : undefined, orderBy: { createdAt: "desc" }, take: PAGE_SIZE }),
  ]);
  const shownTotal = unreadOnly ? unread : total;

  return (
    <AdminShell user={user}>
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">Customers</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Messages</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-primary-600">What visitors send through the contact form on the About page. Reply by email; the visitor&apos;s address is filled in for you.</p>
      </header>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <Metric label="Unread" value={unread} />
        <Metric label="Last 7 days" value={lastWeek} />
        <Metric label="All messages" value={total} />
      </div>

      <section className="mt-8 overflow-hidden rounded-xl border border-primary-100 bg-white">
        <nav className="flex gap-2 border-b border-primary-100 p-4" aria-label="Filter messages">
          <FilterLink href="/admin/messages" active={!unreadOnly} label="All" count={total} />
          <FilterLink href="/admin/messages?show=unread" active={unreadOnly} label="Unread" count={unread} />
        </nav>

        <ul className="divide-y divide-primary-100">
          {messages.map((message) => (
            <li key={message.id}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-start gap-3 px-5 py-4 transition hover:bg-primary-50/60 [&::-webkit-details-marker]:hidden">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${message.isRead ? "bg-transparent" : "bg-accent-500"}`} aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <p className={`text-primary-950 ${message.isRead ? "font-medium" : "font-semibold"}`}>
                        {message.name}
                        {!message.isRead && <span className="sr-only"> (unread)</span>}
                      </p>
                      <p className="text-xs text-primary-500">{lagosTime(message.createdAt)}</p>
                    </div>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-accent-700">{message.topic}</p>
                    <p className="mt-1.5 truncate text-sm text-primary-600 group-open:hidden">{message.message}</p>
                  </div>
                </summary>

                <div className="px-5 pb-5 pl-10">
                  <p className="whitespace-pre-wrap break-words rounded-lg bg-[#f7f3ef] p-4 text-sm leading-relaxed text-primary-900">{message.message}</p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-primary-700">
                    <a className="flex items-center gap-1.5 hover:text-primary-950" href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.topic}`)}`}>
                      <Mail size={14} aria-hidden="true" />{message.email}
                    </a>
                    {message.phone && (
                      <a className="flex items-center gap-1.5 hover:text-primary-950" href={`tel:${message.phone.replace(/[^\d+]/g, "")}`}>
                        <Phone size={14} aria-hidden="true" />{message.phone}
                      </a>
                    )}
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-5">
                    <a className="rounded-lg bg-primary-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-800" href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.topic}`)}`}>Reply by email</a>
                    <form action={setMessageRead}>
                      <input name="id" type="hidden" value={message.id} />
                      <input name="read" type="hidden" value={message.isRead ? "false" : "true"} />
                      <button className="text-sm font-medium text-primary-700 underline-offset-4 hover:text-primary-950 hover:underline" type="submit">
                        {message.isRead ? "Mark as unread" : "Mark as read"}
                      </button>
                    </form>
                    <DeleteMessageButton id={message.id} name={message.name} />
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>

        {messages.length === 0 && (
          <p className="px-5 py-12 text-center text-sm text-primary-600">
            {unreadOnly ? "You're all caught up. No unread messages." : "No messages yet. They'll appear here when someone uses the contact form."}
          </p>
        )}
        {shownTotal > messages.length && (
          <p className="border-t border-primary-100 px-5 py-4 text-xs text-primary-500">Showing the newest {messages.length} of {shownTotal}.</p>
        )}
      </section>
    </AdminShell>
  );
}

function FilterLink({ href, active, label, count }: { href: string; active: boolean; label: string; count: number }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${active ? "bg-primary-950 text-white" : "text-primary-700 hover:bg-primary-50"}`}
    >
      {label} <span className={active ? "text-white/70" : "text-primary-400"}>{count}</span>
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-primary-100 bg-white p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-primary-950 sm:text-3xl">{value.toLocaleString()}</p>
    </div>
  );
}
