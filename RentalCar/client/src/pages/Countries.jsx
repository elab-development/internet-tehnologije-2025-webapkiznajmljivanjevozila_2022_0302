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
    <>
      <div className="h-16 w-full"></div>
      <div className="bg-[#f5f5f7] min-h-screen px-6 md:px-16 lg:px-24 xl:px-32 pt-12 pb-20">
        {/* HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Countries & Currencies
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Powered by{" "}
              <span className="font-medium text-[#c6a96b]">
                RESTCountries API
              </span>
            </p>
          </div>

          {/* SEARCH */}

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by country name or code (Serbia, RS, SRB)"
            className="
          border border-gray-300
          rounded-lg
          px-4 py-2
          w-full sm:w-[420px]
          bg-white
          focus:outline-none
          focus:border-[#c6a96b]
          text-black
          "
          />
        </div>

        {countriesLoading ? (
          <div className="text-gray-500">Loading countries...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((c) => (
              <div
                key={`${c.name}-${c.cca2 || c.cca3 || ""}`}
                className="
              bg-white
              border border-gray-200
              rounded-xl
              p-5
              shadow-sm
              hover:shadow-md
              hover:border-[#c6a96b]
              transition
              "
              >
                <div className="flex items-center gap-4">
                  <img
                    src={c.flag || "https://via.placeholder.com/40x28?text=+"}
                    alt={c.name}
                    className="w-10 h-7 object-cover rounded border"
                  />

                  <div>
                    <div className="font-semibold text-gray-900">{c.name}</div>

                    <div className="text-xs text-gray-500">
                      {c.cca2 || "-"} / {c.cca3 || "-"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  <span className="font-medium text-gray-800">Currencies:</span>{" "}
                  {Array.isArray(c.currencies) && c.currencies.length > 0
                    ? c.currencies.join(", ")
                    : "N/A"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Countries;
