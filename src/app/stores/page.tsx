import type { Metadata } from "next";
import { Navbar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";
import { PageHero } from "@/app/components/page-hero";
import { getActiveStores } from "@/lib/where-to-buy";
import { formatHoursEntry, hasOpeningHours, lagosToday, parseOpeningHours, STORE_DAYS, storeDirectionsUrl, storeOpenStatus } from "@/lib/store-details";
import { StoreFinder, type PublicStore } from "./components/store-finder";

// Rendered per request so "Open now" reflects the current time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Find a store | Caring Chemistry",
  description: "Find a Caring Chemistry store near you, with addresses, opening hours, phone numbers and directions.",
};

export default async function StoreDirectoryPage() {
  const stores = await getActiveStores();
  const now = new Date();
  const today = lagosToday(now);

  // Only plain values go to the client finder (Prisma Decimal and Json are converted here).
  const publicStores: PublicStore[] = stores.map((store) => {
    const hours = parseOpeningHours(store.openingHours);
    const latitude = store.latitude?.toString() ?? null;
    const longitude = store.longitude?.toString() ?? null;
    const dialable = store.phone?.replace(/[^\d+]/g, "") ?? "";
    return {
      id: store.id,
      name: store.name,
      address: store.address,
      city: store.city,
      state: store.state,
      country: store.country,
      phone: store.phone,
      telHref: dialable ? `tel:${dialable}` : null,
      email: store.email,
      directionsUrl: storeDirectionsUrl({ address: store.address, city: store.city, state: store.state, country: store.country, latitude, longitude }),
      status: storeOpenStatus(hours, now),
      hours: hasOpeningHours(hours) ? STORE_DAYS.map((day) => ({ label: day.label, value: formatHoursEntry(hours[day.key]), today: day.key === today })) : null,
    };
  });
  const stateCount = new Set(stores.map((store) => store.state).filter(Boolean)).size;
  const summary = stores.length
    ? `Visit us in person at ${stores.length} ${stores.length === 1 ? "location" : "locations"}${stateCount > 1 ? ` across ${stateCount} states` : ""}. Find your nearest store, its opening hours and directions.`
    : "Find your nearest Caring Chemistry store, its opening hours and directions.";

  return (
    <main>
      <Navbar />
      <PageHero
        crumb="Find a store"
        title="Find a Store"
        description={summary}
        imageSrc="/images/Radience.png"
        imageAlt="A woman applying cream beside a jar of Radiance complexion cream"
        textSide="left"
        mobileFocus="right"
      >
        <StoreFinder stores={publicStores} />
      </PageHero>
      <Footer />
    </main>
  );
}
