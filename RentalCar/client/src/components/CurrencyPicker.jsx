import React from "react";
import { useAppContext } from "../context/useAppContext";

const CurrencyPicker = () => {
  const { selectedCurrency, setSelectedCurrency, currencies } = useAppContext();

  return (
    <div className="relative">
      <select
        value={selectedCurrency}
        onChange={(e) => setSelectedCurrency(e.target.value)}
        className="
        appearance-none
        bg-transparent
        text-white
        border border-[#c6a96b]
        px-4 py-2 pr-10
        rounded-full
        outline-none
        cursor-pointer
        hover:shadow-[0_0_12px_rgba(198,169,107,0.4)]
        transition
        "
      >
        {currencies.map((currency) => (
          <option
            key={currency}
            value={currency}
            className="bg-[#161a20] text-white"
          >
            {currency}
          </option>
        ))}
      </select>

      {/* GOLD ARROW */}
      <div
        className="
        pointer-events-none
        absolute
        right-3
        top-1/2
        -translate-y-1/2
        text-[#c6a96b]
        text-xs
        "
      >
        ▼
      </div>
    </div>
  );
};

export default CurrencyPicker;
