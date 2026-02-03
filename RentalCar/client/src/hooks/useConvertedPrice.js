import { useEffect, useState } from "react";
import { useAppContext } from "../context/useAppContext.js";

export default function useConvertedPrice(amount, from) {
  const { convertAmount, selectedCurrency, BASE_PRICE_CURRENCY } = useAppContext();

  const [value, setValue] = useState(Number(amount ?? 0));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
      const v = await convertAmount(amount, from || BASE_PRICE_CURRENCY, selectedCurrency);
      if (alive) {
        setValue(v);
        setLoading(false);
      }
    };

    run();

    return () => {
      alive = false;
    };
  }, [amount, from, selectedCurrency, BASE_PRICE_CURRENCY, convertAmount]);

  return { value, loading };
}
