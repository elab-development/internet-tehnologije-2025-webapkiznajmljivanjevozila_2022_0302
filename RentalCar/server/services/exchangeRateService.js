import axios from "axios";

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 min
const cache = new Map();

async function getRates(base) {
  const now = Date.now();
  const entry = cache.get(base);

  if (entry && now - entry.ts < CACHE_TTL_MS) return entry.rates;

  const url = `https://open.er-api.com/v6/latest/${base}`;
  const { data } = await axios.get(url, { timeout: 10000 });

  if (!data?.rates) throw new Error("Invalid exchange rate response");

  cache.set(base, { ts: now, rates: data.rates });
  return data.rates;
}

export async function convertCurrency({ amount, from, to }) {
  const a = Number(amount);
  if (Number.isNaN(a)) throw new Error("Invalid amount");
  if (from === to) return a;

  const rates = await getRates(from);
  const rate = rates[to];

  if (!rate) throw new Error(`Rate not found ${from} -> ${to}`);

  return a * rate;
}
