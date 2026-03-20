import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

import Title from "../components/Title";
import CarCard from "../components/CarCard";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/useAppContext.js";

const Cars = () => {
  const { axios } = useAppContext();

  const [searchParams] = useSearchParams();

  const [input, setInput] = useState("");
  const [cars, setCars] = useState([]);
  const [sortBy, setSortBy] = useState("relevant");

  // Hero → Cars
  const [locationFilter, setLocationFilter] = useState(
    searchParams.get("location") || "",
  );
  const [pickupFilter, setPickupFilter] = useState(
    searchParams.get("pickup") || "",
  );
  const [returnFilter, setReturnFilter] = useState(
    searchParams.get("return") || "",
  );

  const [types, setTypes] = useState({
    Coupe: false,
    SUV: false,
    Hatchback: false,
    Sedan: false,
    Convertible: false,
    Van: false,
    "Grand Tourer": false,
  });

  const [priceRanges, setPriceRanges] = useState({
    "0-150": false,
    "150-220": false,
    "220-300": false,
    "300+": false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 8;

  const toggleType = (label) => {
    setTypes((prev) => ({ ...prev, [label]: !prev[label] }));
    setCurrentPage(1);
  };

  const togglePrice = (key) => {
    setPriceRanges((prev) => ({ ...prev, [key]: !prev[key] }));
    setCurrentPage(1);
  };

  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/cars");
      if (data.success) setCars(data.cars);
    } catch (e) {
      toast.error("Failed to load cars");
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // 🔥 DODATO: gradovi iz baze
  const availableCities = useMemo(() => {
    return [...new Set((cars || []).map((c) => c.location).filter(Boolean))];
  }, [cars]);

  const filteredCars = useMemo(() => {
    const q = input.toLowerCase();

    let list = (cars || []).filter((car) => {
      const match =
        !q ||
        car.brand?.toLowerCase().includes(q) ||
        car.model?.toLowerCase().includes(q);

      if (!match) return false;

      // LOCATION
      if (
        locationFilter &&
        car.location?.toLowerCase() !== locationFilter.toLowerCase()
      )
        return false;

      // TYPE
      const anyType = Object.values(types).some(Boolean);
      if (anyType && !types[car.category]) return false;

      // PRICE
      const anyPrice = Object.values(priceRanges).some(Boolean);
      if (anyPrice) {
        const p = car.pricePerDay;

        const inRange =
          (priceRanges["0-150"] && p <= 150) ||
          (priceRanges["150-220"] && p > 150 && p <= 220) ||
          (priceRanges["220-300"] && p > 220 && p <= 300) ||
          (priceRanges["300+"] && p > 300);

        if (!inRange) return false;
      }

      return true;
    });

    if (sortBy === "highToLow")
      list.sort((a, b) => b.pricePerDay - a.pricePerDay);

    if (sortBy === "lowToHigh")
      list.sort((a, b) => a.pricePerDay - b.pricePerDay);

    return list;
  }, [cars, input, types, priceRanges, sortBy, locationFilter]);

  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const paginatedCars = filteredCars.slice(
    (currentPage - 1) * carsPerPage,
    currentPage * carsPerPage,
  );

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="h-[50px] md:h-[60px] bg-gradient-to-b from-[#0f1411] to-[#1a241a]" />

      <div className="flex-1 pb-30 px-6 md:px-12 lg:px-16 xl:px-20">
        <div className="grid lg:grid-cols-[280px_1fr]">
          {/* SIDEBAR */}
          <aside className="bg-white text-black border-r border-gray-200 px-6 py-10 min-h-screen">
            <div className="space-y-8 sticky top-24">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1f1a] leading-tight">
                Available Cars
              </h2>

              <p className="text-gray-500 text-sm mt-0">
                Browse our collection
              </p>

              {/* SEARCH */}
              <div className="flex items-center border border-gray-300 px-5 h-12 rounded-full">
                <img src={assets.search_icon} className="w-4 mr-3 opacity-70" />
                <input
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search cars..."
                  className="w-full bg-transparent outline-none text-black placeholder:text-gray-400"
                />
              </div>

              {/* LOCATION */}
              <div>
                <h3 className="mb-3 font-semibold text-[#1a1f1a]">Location</h3>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-white text-black"
                >
                  <option value="">All locations</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* DATES */}
              <div>
                <h3 className="mb-3 font-semibold text-[#1a1f1a]">Dates</h3>

                <input
                  type="date"
                  value={pickupFilter}
                  onChange={(e) => setPickupFilter(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg mb-2"
                />

                <input
                  type="date"
                  value={returnFilter}
                  onChange={(e) => setReturnFilter(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg"
                />
              </div>

              {/* SORT */}
              <div>
                <h3 className="mb-3 font-semibold text-[#1a1f1a]">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-white text-black"
                >
                  <option value="relevant">Relevant</option>
                  <option value="highToLow">Price High to Low</option>
                  <option value="lowToHigh">Price Low to High</option>
                </select>
              </div>

              {/* TYPE */}
              <div>
                <h3 className="mb-3 font-semibold text-[#1a1f1a]">Car Type</h3>
                <div className="space-y-2 text-gray-700 text-sm">
                  {Object.keys(types).map((t) => (
                    <label key={t} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={types[t]}
                        onChange={() => toggleType(t)}
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              {/* PRICE */}
              <div>
                <h3 className="mb-3 font-semibold text-[#1a1f1a]">
                  Price Range
                </h3>
                <div className="space-y-2 text-gray-700 text-sm">
                  {Object.keys(priceRanges).map((p) => (
                    <label key={p} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={priceRanges[p]}
                        onChange={() => togglePrice(p)}
                      />
                      {p}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* CARS */}
          <div className="px-6 md:px-10 lg:px-14 xl:px-20">
            <div className="mb-10 mt-10"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-10">
              {paginatedCars.length === 0 ? (
                <p className="text-gray-500">No cars found.</p>
              ) : (
                paginatedCars.map((car) => <CarCard key={car._id} car={car} />)
              )}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-14">
                <button
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                  className="px-4 py-2 rounded border border-[#c6a96b] text-[#c6a96b] hover:bg-[#c6a96b]/10 disabled:opacity-30"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i + 1)}
                    className={`px-4 py-2 rounded border ${
                      currentPage === i + 1
                        ? "bg-[#c6a96b] text-black border-[#c6a96b]"
                        : "border-[#c6a96b] text-[#c6a96b] hover:bg-[#c6a96b]/10"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                  className="px-4 py-2 rounded border border-[#c6a96b] text-[#c6a96b] hover:bg-[#c6a96b]/10 disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cars;
