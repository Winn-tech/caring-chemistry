import Link from "next/link";
import Image from "next/image";
import { Home, Search, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f9f5f2] text-[#2e2032]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 lg:px-10">
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="Caring Chemistry home">
            <Image
              src="/logo/Caring_Chemistry_Logo.png"
              alt="Caring Chemistry"
              width={62}
              height={62}
              priority
            />
            <span className="font-display text-xl font-semibold tracking-tight text-primary-950">
              Caring Chemistry
            </span>
          </Link>

          <Link
            href="/shop"
            className="rounded-full border border-primary-200 bg-white px-4 py-2 text-sm font-medium text-primary-900 transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            Shop now
          </Link>
        </div>

        <div className="grid flex-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="max-w-xl">
            <p className="font-accent text-2xl italic text-accent-600">Lost in the ritual?</p>
            <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-primary-950 sm:text-6xl">
              This page isn’t here.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-primary-600 sm:text-lg">
              The page you’re looking for may have moved, or the link may be out of date. Let’s get you back to the essentials.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
              >
                <Home size={16} />
                Return home
              </Link>

              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary-200 bg-white px-6 py-3 text-sm font-semibold text-primary-900 transition-colors hover:border-primary-300 hover:bg-primary-50"
              >
                <Search size={16} />
                Browse products
              </Link>
            </div>

            <div className="mt-10 grid gap-3 border-t border-primary-100 pt-6 sm:grid-cols-3">
              <Link href="/ritual" className="rounded-2xl border border-primary-100 bg-white p-4 transition-colors hover:border-accent-200 hover:bg-primary-50">
                <p className="font-display text-xl font-semibold text-primary-950">Ritual</p>
                <p className="mt-2 text-sm text-primary-600">Build a simple daily routine.</p>
              </Link>
              <Link href="/journal" className="rounded-2xl border border-primary-100 bg-white p-4 transition-colors hover:border-accent-200 hover:bg-primary-50">
                <p className="font-display text-xl font-semibold text-primary-950">Journal</p>
                <p className="mt-2 text-sm text-primary-600">Learn about your skin.</p>
              </Link>
              <Link href="/about" className="rounded-2xl border border-primary-100 bg-white p-4 transition-colors hover:border-accent-200 hover:bg-primary-50">
                <p className="font-display text-xl font-semibold text-primary-950">About</p>
                <p className="mt-2 text-sm text-primary-600">Our philosophy and approach.</p>
              </Link>
            </div>
          </section>

          <aside className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border border-primary-100 bg-[#efe4e5] p-4 shadow-[0_24px_80px_rgba(62,28,49,0.08)]">
              <div className="relative h-[540px] overflow-hidden rounded-[1.5rem] bg-[#eadfe6]">
                <Image
                  src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80"
                  alt="Skincare products and ritual essentials"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2e2032]/55 via-[#2e2032]/15 to-transparent" />
              </div>
              <div className="absolute -left-2 bottom-8 flex items-center gap-3 rounded-2xl border border-primary-100 bg-white/90 px-4 py-3 shadow-lg shadow-primary-950/5 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7edf3] text-accent-600">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-500">
                    Ritual note
                  </p>
                  <p className="mt-1 text-sm font-medium text-primary-900">
                    Start simple. Stay consistent.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
