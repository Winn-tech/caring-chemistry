import { NewsletterCampaignStatus, Role } from "@/generated/prisma/enums";
import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { newsletterAllowance, newsletterSendsInBackground, pendingRecipientCount, stuckCampaignCutoff } from "@/lib/newsletter-campaign";
import { AdminShell } from "../components/admin-shell";
import { CampaignForm } from "./components/campaign-form";
import { SendCampaignForm } from "./components/send-campaign-form";
import { ContinueCampaignForm } from "./components/continue-campaign-form";
import { AutoRefresh } from "./components/auto-refresh";
import { releaseStuckCampaign, unsubscribeSubscriber } from "./actions";

export const dynamic = "force-dynamic";
// When sending inline (NEWSLETTER_SEND_MODE unset), the send runs inside a Server Action on this
// page and needs more than the default timeout. In background mode (Netlify) this is unused.
export const maxDuration = 300;

const IN_PROGRESS: NewsletterCampaignStatus[] = [NewsletterCampaignStatus.QUEUED, NewsletterCampaignStatus.SENDING];
const RESUMABLE: NewsletterCampaignStatus[] = [NewsletterCampaignStatus.PAUSED, NewsletterCampaignStatus.FAILED];

const STATUS_LABEL: Record<NewsletterCampaignStatus, { text: string; tone: string }> = {
  DRAFT: { text: "Draft", tone: "bg-primary-100 text-primary-700" },
  QUEUED: { text: "Starting", tone: "bg-amber-50 text-amber-700" },
  SENDING: { text: "Sending", tone: "bg-amber-50 text-amber-700" },
  PAUSED: { text: "Paused", tone: "bg-sky-50 text-sky-700" },
  SENT: { text: "Sent", tone: "bg-emerald-50 text-emerald-700" },
  FAILED: { text: "Failed", tone: "bg-red-50 text-red-700" },
};

const lagosTime = (date: Date) => date.toLocaleString("en-NG", { timeZone: "Africa/Lagos", dateStyle: "medium", timeStyle: "short" });

export default async function NewsletterPage() {
  const user = await requireAdminPage([Role.GENERAL_ADMIN]);
  const stuckBefore = stuckCampaignCutoff();
  const automatic = newsletterSendsInBackground();
  const [subscriberCount, activeCount, inactiveCount, subscribers, campaigns, allowance] = await Promise.all([
    prisma.newsletterSubscriber.count(),
    prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    prisma.newsletterSubscriber.count({ where: { isActive: false } }),
    prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" }, take: 50, select: { id: true, email: true, isActive: true, createdAt: true } }),
    prisma.newsletterCampaign.findMany({ orderBy: { createdAt: "desc" }, take: 20, select: { id: true, subject: true, status: true, recipientCount: true, sentAt: true, createdAt: true, updatedAt: true } }),
    newsletterAllowance(),
  ]);

  // Exact "still to go" counts for campaigns that are part-way through.
  const partial = campaigns.filter((campaign) => [...IN_PROGRESS, ...RESUMABLE].includes(campaign.status));
  const pendingCounts = new Map(await Promise.all(partial.map(async (campaign) => [campaign.id, await pendingRecipientCount(campaign.id)] as const)));
  const sending = campaigns.some((campaign) => IN_PROGRESS.includes(campaign.status) && campaign.updatedAt >= stuckBefore);

  return (
    <AdminShell user={user}>
      {sending && <AutoRefresh />}
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">Audience</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Newsletter</h1>
        <p className="mt-2 text-sm text-primary-600">Manage subscribers and send considered updates from Caring Chemistry.</p>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Metric label="Subscribers" value={subscriberCount} />
        <Metric label="Active" value={activeCount} />
        <Metric label="Unsubscribed" value={inactiveCount} />
      </div>

      <section className="mt-4 rounded-xl border border-primary-100 bg-white p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-primary-500">Daily sending allowance</h2>
          <p className="text-sm text-primary-700">
            <span className="font-semibold text-primary-950">{allowance.remaining}</span> of {allowance.limit} left · {allowance.used} sent in the last 24 hours
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-primary-100" aria-hidden="true">
          <div className="h-full rounded-full bg-accent-500" style={{ width: `${Math.min(100, (allowance.used / allowance.limit) * 100)}%` }} />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-primary-500">
          Campaigns larger than the allowance send in parts and never email anyone twice.{" "}
          {automatic ? "Paused campaigns continue automatically, checked every hour." : "Use “Continue sending now” on a paused campaign when allowance is available."}
          {allowance.nextFreeAt && ` More allowance frees up from ${lagosTime(allowance.nextFreeAt)}.`}
        </p>
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.65fr)]">
        <section>
          <h2 className="font-display text-2xl font-semibold">Create newsletter</h2>
          <p className="mt-2 text-sm text-primary-600">Save a draft first, then send it to active subscribers.</p>
          <div className="mt-5"><CampaignForm /></div>

          <h2 className="mt-10 font-display text-2xl font-semibold">Campaigns</h2>
          <div className="mt-5 space-y-3">
            {campaigns.map((campaign) => {
              const label = STATUS_LABEL[campaign.status];
              const stuck = IN_PROGRESS.includes(campaign.status) && campaign.updatedAt < stuckBefore;
              const toGo = pendingCounts.get(campaign.id) ?? 0;
              return (
                <article className="rounded-xl border border-primary-100 bg-white p-5" key={campaign.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-primary-950">{campaign.subject}</h3>
                      <p className="mt-1 text-xs text-primary-500">Created {campaign.createdAt.toLocaleDateString("en-NG", { dateStyle: "medium" })}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${label.tone}`}>{label.text}</span>
                  </div>

                  {campaign.status === NewsletterCampaignStatus.DRAFT && <SendCampaignForm id={campaign.id} recipientCount={activeCount} allowanceRemaining={allowance.remaining} />}

                  {IN_PROGRESS.includes(campaign.status) && (stuck ? (
                    <form action={releaseStuckCampaign} className="mt-3 flex flex-wrap items-center gap-3">
                      <input name="id" type="hidden" value={campaign.id} />
                      <p className="text-xs text-red-700">{campaign.status === NewsletterCampaignStatus.QUEUED ? "This send never started." : `This send stopped after ${campaign.recipientCount} subscribers.`}</p>
                      <button className="text-xs font-semibold text-primary-700 underline hover:text-primary-950" type="submit">
                        {campaign.status === NewsletterCampaignStatus.SENDING ? "Mark as failed" : campaign.recipientCount > 0 ? "Mark as paused" : "Return to drafts"}
                      </button>
                    </form>
                  ) : (
                    <p className="mt-3 text-xs text-primary-500">
                      {campaign.status === NewsletterCampaignStatus.QUEUED ? "Starting the send…" : `Sending… ${campaign.recipientCount} sent so far, ${toGo} to go`}
                    </p>
                  ))}

                  {campaign.status === NewsletterCampaignStatus.PAUSED && (
                    <>
                      <p className="mt-3 text-xs text-primary-600">
                        {campaign.recipientCount} sent · {toGo} still to go.{" "}
                        {toGo === 0 ? "Everyone has it; continuing will mark it as sent." : automatic ? "Continues automatically when the daily allowance frees up." : "Continue when the daily allowance frees up."}
                      </p>
                      <ContinueCampaignForm id={campaign.id} retry={false} />
                    </>
                  )}

                  {campaign.status === NewsletterCampaignStatus.FAILED && (
                    <>
                      <p className="mt-3 text-xs text-red-700">
                        Stopped after {campaign.recipientCount} subscribers ({toGo} still to go). Retrying only sends to people who haven&apos;t received it.
                      </p>
                      <ContinueCampaignForm id={campaign.id} retry />
                    </>
                  )}

                  {campaign.status === NewsletterCampaignStatus.SENT && (
                    <p className="mt-3 text-xs text-primary-500">
                      Sent to {campaign.recipientCount} subscribers{campaign.sentAt ? ` · finished ${lagosTime(campaign.sentAt)}` : ""}
                    </p>
                  )}
                </article>
              );
            })}
            {campaigns.length === 0 && <p className="rounded-xl border border-dashed border-primary-200 px-5 py-10 text-sm text-primary-600">No campaigns yet.</p>}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold">Subscribers</h2>
          <div className="mt-5 overflow-hidden rounded-xl border border-primary-100 bg-white">
            <div className="max-h-[36rem] overflow-y-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-primary-100 bg-primary-50 text-xs uppercase tracking-wide text-primary-600">
                  <tr><th className="px-4 py-3">Email</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"><span className="sr-only">Action</span></th></tr>
                </thead>
                <tbody className="divide-y divide-primary-100">
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-primary-900">{subscriber.email}</p>
                        <p className="mt-1 text-xs text-primary-500">{subscriber.createdAt.toLocaleDateString("en-NG", { dateStyle: "medium" })}</p>
                      </td>
                      <td className="px-4 py-3"><span className={subscriber.isActive ? "text-emerald-700" : "text-primary-500"}>{subscriber.isActive ? "Active" : "Unsubscribed"}</span></td>
                      <td className="px-4 py-3 text-right">
                        {subscriber.isActive && (
                          <form action={unsubscribeSubscriber}>
                            <input name="id" type="hidden" value={subscriber.id} />
                            <button className="text-xs font-semibold text-primary-600 hover:text-primary-950" type="submit">Unsubscribe</button>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {subscribers.length === 0 && <p className="px-4 py-10 text-center text-sm text-primary-600">No subscribers yet.</p>}
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-primary-100 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-primary-950">{value.toLocaleString()}</p>
    </div>
  );
}
