import axios from "axios";

export async function fetchCountries() {
  const url =
    "https://restcountries.com/v3.1/all?fields=name,cca2,cca3,flags,currencies";
  const { data } = await axios.get(url, { timeout: 10000 });

  return data
    .map((c) => ({
      name: c?.name?.common,
      cca2: c?.cca2,
      cca3: c?.cca3,
      flag: c?.flags?.png || c?.flags?.svg,
      currencies: c?.currencies ? Object.keys(c.currencies) : [],
    }))
    .filter((x) => x.name)
    .sort((a, b) => a.name.localeCompare(b.name));
}
