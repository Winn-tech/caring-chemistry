/** The company's registered address. Shown in the site footer, newsletter emails and search-engine data. */
export const COMPANY_ADDRESS = {
  street: "KM 14, Idi Oroko Road",
  city: "Otta",
  region: "Ogun State",
  country: "Nigeria",
  countryCode: "NG",
};

export const COMPANY_ADDRESS_LINE = [COMPANY_ADDRESS.street, COMPANY_ADDRESS.city, COMPANY_ADDRESS.region, COMPANY_ADDRESS.country].join(", ");

export const COMPANY_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY_ADDRESS_LINE)}`;

/** Google Maps embed for the same address; needs no API key. */
export const COMPANY_MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(COMPANY_ADDRESS_LINE)}&z=15&output=embed`;

export const COMPANY_SOCIAL_URLS = [
  "https://www.facebook.com/Caringchemistryltd",
  "https://www.instagram.com/caringchemistryltd",
];
