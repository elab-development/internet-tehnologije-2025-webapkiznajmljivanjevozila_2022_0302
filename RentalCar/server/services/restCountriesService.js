import axios from "axios";

const DEFAULT_URL =
  "https://restcountries.com/v3.1/all?fields=name,cca2,cca3,flags,currencies";

export const fetchCountries = async () => {
  const url = process.env.RESTCOUNTRIES_URL || DEFAULT_URL;

  try {
    const { data } = await axios.get(url, {
      timeout: 15000,
      headers: {
        Accept: "application/json",
        "User-Agent": "CarRental/1.0",
      },
    });

    if (!Array.isArray(data)) {
      throw new Error("RESTCountries returned invalid payload");
    }

    const mapped = data
      .map((c) => {
        const name = c?.name?.common || "";
        const cca2 = c?.cca2 || "";
        const cca3 = c?.cca3 || "";

        const flag = c?.flags?.png || c?.flags?.svg || "";

        const currenciesObj = c?.currencies || {};
        const currencies = Object.keys(currenciesObj || {}).filter(Boolean);

        return { name, cca2, cca3, flag, currencies };
      })
      .filter((c) => c.name)
      .sort((a, b) => a.name.localeCompare(b.name));

    return mapped;
  } catch (e) {
    const status = e?.response?.status;
    const detail = e?.response?.data
      ? JSON.stringify(e.response.data).slice(0, 200)
      : e?.message;

    throw new Error(
      `RESTCountries fetch failed${status ? ` (${status})` : ""}: ${detail}`,
    );
  }
};
