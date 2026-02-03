import React, { useMemo, useState } from "react";
import { useAppContext } from "../context/useAppContext.js";

const Countries = () => {
  const { countries, countriesLoading } = useAppContext();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return countries;

    return countries.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const cca2 = (c.cca2 || "").toLowerCase();
      const cca3 = (c.cca3 || "").toLowerCase();
      return (
        name.includes(query) || cca2.includes(query) || cca3.includes(query)
      );
    });
  }, [countries, q]);

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10 mb-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Countries & Currencies
          </h1>
          <p className="text-gray-500 text-sm">
            Powered by <span className="font-medium">RESTCountries API</span>
          </p>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by country name / code (e.g. Serbia, RS, SRB)"
          className="border border-borderColor rounded-lg px-3 py-2 w-full sm:w-[420px]"
        />
      </div>

      {countriesLoading ? (
        <div className="text-gray-500">Loading countries...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div
              key={`${c.name}-${c.cca2 || c.cca3 || ""}`}
              className="border border-borderColor rounded-xl p-4 bg-white shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img
                  src={c.flag || "https://via.placeholder.com/40x28?text=+"}
                  alt={c.name}
                  className="w-10 h-7 object-cover rounded border"
                />
                <div>
                  <div className="font-semibold text-gray-800">{c.name}</div>
                  <div className="text-xs text-gray-500">
                    {c.cca2 || "-"} / {c.cca3 || "-"}
                  </div>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-600">
                <span className="font-medium">Currencies:</span>{" "}
                {Array.isArray(c.currencies) && c.currencies.length > 0
                  ? c.currencies.join(", ")
                  : "N/A"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Countries;
