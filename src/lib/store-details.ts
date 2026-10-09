// Shared store helpers for the admin store editor and the public "Find a store" page:
// weekly opening hours, the "Open now" status, directions links and Google Maps link parsing.

export const STORE_DAYS = [
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
] as const;

export type StoreDay = (typeof STORE_DAYS)[number]["key"];
/** Stored per day as "HH:MM-HH:MM" (24-hour) or "closed". Days left out are "hours not listed". */
export type OpeningHours = Partial<Record<StoreDay, string>>;

/** Stores are in Nigeria, so "open now" is judged on Lagos time whatever the visitor's clock says. */
const STORE_TIME_ZONE = "Africa/Lagos";
const TIME = /^([01]\d|2[0-3]):([0-5]\d)$/;
const RANGE = /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/;

export function isValidTime(value: string) {
  return TIME.test(value);
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/** Reads stored hours defensively: unknown days and malformed values are ignored, never shown. */
export function parseOpeningHours(value: unknown): OpeningHours {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const hours: OpeningHours = {};
  for (const { key } of STORE_DAYS) {
    const raw = (value as Record<string, unknown>)[key];
    if (typeof raw !== "string") continue;
    const entry = raw.trim().toLowerCase();
    if (entry === "closed") hours[key] = "closed";
    else if (RANGE.test(entry) && toMinutes(entry.slice(6)) > toMinutes(entry.slice(0, 5))) hours[key] = entry;
  }
  return hours;
}

export function hasOpeningHours(hours: OpeningHours) {
  return Object.keys(hours).length > 0;
}

/** "09:00" -> "9:00 AM" */
export function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours < 12 ? "AM" : "PM";
  return `${hours % 12 === 0 ? 12 : hours % 12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

/** "09:00-18:00" -> "9:00 AM – 6:00 PM"; "closed" -> "Closed" */
export function formatHoursEntry(entry: string | undefined) {
  if (!entry) return "Not listed";
  if (entry === "closed") return "Closed";
  return `${formatTime(entry.slice(0, 5))} – ${formatTime(entry.slice(6))}`;
}

/** The weekday and minutes past midnight right now in Lagos. */
function lagosNow(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: STORE_TIME_ZONE, weekday: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return { day: part("weekday").toLowerCase() as StoreDay, minutes: Number(part("hour")) * 60 + Number(part("minute")) };
}

/** Today's weekday key in Lagos, e.g. "monday". */
export function lagosToday(now = new Date()): StoreDay {
  return lagosNow(now).day;
}

export type OpenStatus = { open: boolean; label: string };

/** "Open now · until 6:00 PM" / "Closed now". Null when today's hours are not listed. */
export function storeOpenStatus(hours: OpeningHours, now = new Date()): OpenStatus | null {
  const { day, minutes } = lagosNow(now);
  const today = hours[day];
  if (!today) return null;
  if (today === "closed") return { open: false, label: "Closed today" };
  const opens = toMinutes(today.slice(0, 5));
  const closes = toMinutes(today.slice(6));
  if (minutes >= opens && minutes < closes) return { open: true, label: `Open now · until ${formatTime(today.slice(6))}` };
  if (minutes < opens) return { open: false, label: `Closed · opens ${formatTime(today.slice(0, 5))}` };
  return { open: false, label: "Closed now" };
}

/** Google Maps directions: exact coordinates when known, otherwise the address. */
export function storeDirectionsUrl(store: { address: string; city: string | null; state: string | null; country: string; latitude: string | null; longitude: string | null }) {
  const query = store.latitude && store.longitude
    ? `${store.latitude},${store.longitude}`
    : [store.address, store.city, store.state, store.country].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** A Google Maps link for existing coordinates, so the editor can show them in its link field. */
export function mapsLinkFromCoordinates(latitude: string | null, longitude: string | null) {
  return latitude && longitude ? `https://www.google.com/maps?q=${latitude},${longitude}` : "";
}

/**
 * Pulls coordinates out of a full Google Maps link, e.g. ".../@6.5244,3.3792,17z",
 * "...?q=6.5244,3.3792" or ".../data=!3d6.5244!4d3.3792". Short share links
 * (maps.app.goo.gl) do not contain coordinates, so they return null.
 */
export function coordinatesFromMapsLink(link: string): { latitude: number; longitude: number } | null {
  const patterns = [/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/, /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/, /[?&](?:q|query|ll|destination)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/];
  const decoded = (() => {
    try { return decodeURIComponent(link); } catch { return link; }
  })();
  for (const pattern of patterns) {
    const match = decoded.match(pattern);
    if (!match) continue;
    const latitude = Number(match[1]);
    const longitude = Number(match[2]);
    if (Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180) return { latitude: Number(latitude.toFixed(6)), longitude: Number(longitude.toFixed(6)) };
  }
  return null;
}
