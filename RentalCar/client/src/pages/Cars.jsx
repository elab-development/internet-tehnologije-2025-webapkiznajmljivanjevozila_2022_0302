import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import Title from "../components/Title";
import CarCard from "../components/CarCard";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Cars = () => {
  const { axios } = useAppContext();

  const [input, setInput] = useState("");

  // URL params
  const [searchParams] = useSearchParams();
  const pickupLocation = searchParams.get("pickupLocation") || "";
  const pickupDate = searchParams.get("pickupDate") || "";
  const returnDate = searchParams.get("returnDate") || "";

  const isSearchData =
    pickupLocation.trim() && pickupDate.trim() && returnDate.trim();

  // Cars returned from availability endpoint
  const [availableCars, setAvailableCars] = useState([]);

  // Right-side filters
  const [sortBy, setSortBy] = useState("relevant"); // relevant | highToLow | lowToHigh
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

  // Pagination
  const ITEMS_PER_PAGE = 6;
  const [page, setPage] = useState(1);

  const toggleType = (label) => {
    setTypes((prev) => ({ ...prev, [label]: !prev[label] }));
    setPage(1);
  };

  const togglePrice = (key) => {
    setPriceRanges((prev) => ({ ...prev, [key]: !prev[key] }));
    setPage(1);
  };

  const fetchAvailability = async () => {
    try {
      const { data } = await axios.post("/api/booking/check-availability", {
        pickupLocation: pickupLocation.trim(),
        pickupDate,
        returnDate,
      });

      if (data.success) {
        setAvailableCars(data.availableCars || []);
        if (!data.availableCars || data.availableCars.length === 0) {
          toast.error("No cars available");
        }
      } else {
        toast.error(data.message || "Availability check failed");
        setAvailableCars([]);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message);
      setAvailableCars([]);
    }
  };

  useEffect(() => {
    if (isSearchData) fetchAvailability();
    else setAvailableCars([]);
    // reset page on new search
    setPage(1);
  }, [pickupLocation, pickupDate, returnDate]);

  const filteredAndSorted = useMemo(() => {
    const q = input.trim().toLowerCase();

    let list = (availableCars || []).filter((car) => {
      const brand = (car.brand ?? "").toLowerCase();
      const model = (car.model ?? "").toLowerCase();
      const category = (car.category ?? "").toLowerCase();
      const fuel = (car.fuel_type ?? "").toLowerCase(); // ako ti je fuelType, promeni ovde
      const transmission = (car.transmission ?? "").toLowerCase();
      const location = (car.location ?? "").toLowerCase();

      const matchesSearch =
        !q ||
        brand.includes(q) ||
        model.includes(q) ||
        category.includes(q) ||
        fuel.includes(q) ||
        transmission.includes(q) ||
        location.includes(q);

      if (!matchesSearch) return false;

      // Type filter
      const anyTypeChecked = Object.values(types).some(Boolean);
      if (anyTypeChecked) {
        const cat = car.category ?? "";
        if (!types[cat]) return false;
      }

      // Price filter
      const anyPriceChecked = Object.values(priceRanges).some(Boolean);
      if (anyPriceChecked) {
        const price = Number(car.pricePerDay ?? 0);

        const inRange =
          (priceRanges["0-150"] && price >= 0 && price <= 150) ||
          (priceRanges["150-220"] && price > 150 && price <= 220) ||
          (priceRanges["220-300"] && price > 220 && price <= 300) ||
          (priceRanges["300+"] && price > 300);

        if (!inRange) return false;
      }

      return true;
    });

    // Sort
    if (sortBy === "highToLow") {
      list = [...list].sort(
        (a, b) => Number(b.pricePerDay ?? 0) - Number(a.pricePerDay ?? 0)
      );
    } else if (sortBy === "lowToHigh") {
      list = [...list].sort(
        (a, b) => Number(a.pricePerDay ?? 0) - Number(b.pricePerDay ?? 0)
      );
    }

    return list;
  }, [availableCars, input, sortBy, types, priceRanges]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE)
  );
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredAndSorted.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSorted, safePage]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col items-center py-20 bg-light max-md:px-4">
        <Title
          title="Available Cars"
          subTitle="Browse our selection of premium vehicles available for your next adventure"
        />

        <div className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">
          <img
            src={assets.search_icon}
            alt=""
            className="w-4.5 h-4.5 mr-2"
          />

          <input
            onChange={(e) => {
              setInput(e.target.value);
              setPage(1);
            }}
            value={input}
            type="text"
            placeholder="Search by make, model, or features"
            className="w-full h-full outline-none text-gray-500"
          />

          <img
            src={assets.filter_icon}
            alt=""
            className="w-4.5 h-4.5 ml-2"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
          Showing {filteredAndSorted.length} Cars
        </p>

        <div className="mt-6 xl:px-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          {/* Left: cards */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pageItems.map((car) => (
                <div key={car._id} className="h-full">
                  <div className="h-full flex">
                    <div className="w-full">
                      <CarCard car={car} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  onClick={goPrev}
                  disabled={safePage === 1}
                  className={`px-6 py-2 rounded-full font-medium transition-all
                    ${
                      safePage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-sky-200 text-gray-700 hover:bg-sky-300"
                    }`}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-full border transition-all
                      ${
                        p === safePage
                          ? "bg-gray-100 border-gray-300"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={goNext}
                  disabled={safePage === totalPages}
                  className={`px-6 py-2 rounded-full font-medium transition-all
                    ${
                      safePage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-sky-500 text-white hover:bg-sky-600"
                    }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Right: Filters */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl shadow p-5">
              <div className="flex items-center gap-3 border border-gray-200 rounded-full px-4 h-12">
                <img
                  src={assets.search_icon}
                  alt=""
                  className="w-4.5 h-4.5 opacity-70"
                />
                <input
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setPage(1);
                  }}
                  type="text"
                  placeholder="Search by make"
                  className="w-full h-full outline-none text-gray-500"
                />
                <img
                  src={assets.filter_icon}
                  alt=""
                  className="w-4.5 h-4.5 opacity-70"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Sort By
              </h3>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-600 outline-none"
              >
                <option value="relevant">Relevant</option>
                <option value="highToLow">High to Low</option>
                <option value="lowToHigh">Low to High</option>
              </select>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Car Type
              </h3>
              <div className="space-y-3 text-gray-600">
                {Object.keys(types).map((t) => (
                  <label key={t} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={types[t]}
                      onChange={() => toggleType(t)}
                      className="w-5 h-5"
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Price Range (per day)
              </h3>
              <div className="space-y-3 text-gray-600">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={priceRanges["0-150"]}
                    onChange={() => togglePrice("0-150")}
                    className="w-5 h-5"
                  />
                  <span>$0 to $150</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={priceRanges["150-220"]}
                    onChange={() => togglePrice("150-220")}
                    className="w-5 h-5"
                  />
                  <span>$150 to $220</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={priceRanges["220-300"]}
                    onChange={() => togglePrice("220-300")}
                    className="w-5 h-5"
                  />
                  <span>$220 to $300</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={priceRanges["300+"]}
                    onChange={() => togglePrice("300+")}
                    className="w-5 h-5"
                  />
                  <span>$300+</span>
                </label>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cars;
