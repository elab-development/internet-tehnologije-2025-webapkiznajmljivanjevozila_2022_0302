import React from "react";
import { useAppContext } from "../context/useAppContext.js";

const CurrencyPicker = () => {
  const { currencies, currenciesLoading, selectedCurrency, setSelectedCurrency } = useAppContext();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Currency:</span>
      <select
        value={selectedCurrency}
        onChange={(e) => setSelectedCurrency(e.target.value)}
        className="border border-borderColor rounded-md px-2 py-1 text-sm bg-white"
        disabled={currenciesLoading}
      >
        {currenciesLoading ? (
          <option>Loading...</option>
        ) : (
          currencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default CurrencyPicker;
