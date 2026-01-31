export function normalize(s) {
  return String(s || "")
    .trim()
    .toLowerCase();
}

/**
 * car.location može biti:
 * - "Serbia" (ime države)
 * - "RS" (cca2)
 * - "SRB" (cca3)
 *
 * Ako ti je location "New York", neće naći državu (to je okej).
 */
export function findCountryByLocation(countries, location) {
  if (!Array.isArray(countries) || !location) return null;

  const loc = normalize(location);

  return (
    countries.find((c) => normalize(c.name) === loc) ||
    countries.find((c) => normalize(c.cca2) === loc) ||
    countries.find((c) => normalize(c.cca3) === loc) ||
    null
  );
}
