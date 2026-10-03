import { unsubscribeByToken } from "@/lib/newsletter";

/**
 * RFC 8058 one-click unsubscribe. Mail providers (Gmail, Yahoo) POST here when a reader uses
 * their built-in "Unsubscribe" button; the address comes from the List-Unsubscribe header.
 */
export async function POST(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (token.length >= 20 && token.length <= 200) {
    try {
      await unsubscribeByToken(token);
    } catch (error) {
      console.error("One-click unsubscribe failed", error);
      return new Response(null, { status: 500 });
    }
  }
  // Same response whether or not the token matched, so tokens cannot be probed.
  return new Response(null, { status: 200, headers: { "Cache-Control": "no-store" } });
}
