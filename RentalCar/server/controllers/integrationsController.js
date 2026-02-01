import { fetchCountries } from "../services/restCountriesService.js";
import { convertCurrency } from "../services/exchangeRateService.js";

export const getCountries = async (req, res) => {
  try {
    const countries = await fetchCountries();
    return res.json({ success: true, countries });
  } catch (e) {
    console.error("❌ getCountries:", e?.message || e);
    return res.status(500).json({
      success: false,
      message: e?.message || "Failed to fetch countries",
    });
  }
};

export const convert = async (req, res) => {
  try {
    const { amount, from, to } = req.query;

    if (!amount || !from || !to) {
      return res.status(400).json({
        success: false,
        message: "amount, from and to are required",
      });
    }

    const converted = await convertCurrency({ amount, from, to });
    return res.json({
      success: true,
      amount: Number(amount),
      from,
      to,
      converted,
    });
  } catch (e) {
    console.error("❌ convert:", e?.message || e);
    return res.status(500).json({
      success: false,
      message: e?.message || "Conversion failed",
    });
  }
};
