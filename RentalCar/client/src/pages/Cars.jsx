import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import Title from "../components/Title";
import CarCard from "../components/CarCard";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/useAppContext.js";

const Cars = () => {
  const { axios } = useAppContext();

  const [input, setInput] = useState("");
  const [cars, setCars] = useState([]);

  const [searchParams] = useSearchParams();
  const pickupLocation = searchParams.get("pickupLocation") || "";
  const pickupDate = searchParams.get("pickupDate") || "";
  const returnDate = searchParams.get("returnDate") || "";

  const [sortBy, setSortBy] = useState("relevant");

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
  const carsPerPage = 12; // sada 4x3 grid

  const toggleType = (label) => {
    setTypes((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const togglePrice = (key) => {
    setPriceRanges((prev) => ({ ...prev, [key]: !prev[key] }));
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

  const filteredCars = useMemo(() => {
    const q = input.toLowerCase();

    let list = (cars || []).filter((car) => {
      const match =
        !q ||
        car.brand.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q);

      if (!match) return false;

      const anyType = Object.values(types).some(Boolean);
      if (anyType && !types[car.category]) return false;

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
  }, [cars, input, types, priceRanges, sortBy]);

  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const startIndex = (currentPage - 1) * carsPerPage;
  const endIndex = startIndex + carsPerPage;

  const paginatedCars = filteredCars.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pt-24 pb-20 px-6 md:px-12 lg:px-16 xl:px-20">
      <div className="grid lg:grid-cols-[300px_1fr] gap-12">
        {/* SIDEBAR */}

        <aside className="space-y-8">
          <Title
            title="Available Cars"
            subTitle="Browse our premium fleet"
            align="left"
          />

          {/* SEARCH */}

          <div className="flex items-center border border-[#c6a96b]/40 px-5 h-12 rounded-full">
            <img src={assets.search_icon} className="w-4 mr-3 opacity-70" />

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search cars..."
              className="w-full bg-transparent outline-none text-white placeholder:text-gray-400"
            />
          </div>

          {/* SORT */}

          <div className="bg-[#11151c] rounded-xl p-6">
            <h3 className="text-white mb-4 font-semibold">Sort By</h3>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#11151c] border border-[#c6a96b]/30 px-4 py-3 rounded-lg text-white focus:outline-none focus:border-[#c6a96b]"
            >
              <option value="relevant">Relevant</option>
              <option value="highToLow">Price High to Low</option>
              <option value="lowToHigh">Price Low to High</option>
            </select>
          </div>

          {/* TYPE */}

          <div className="bg-[#11151c] rounded-xl p-6">
            <h3 className="text-white mb-4 font-semibold">Car Type</h3>

            <div className="space-y-3 text-gray-400">
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

          <div className="bg-[#11151c] rounded-xl p-6">
            <h3 className="text-white mb-4 font-semibold">Price Range</h3>

            <div className="space-y-3 text-gray-400">
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
        </aside>

        {/* CARS */}

        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {paginatedCars.length === 0 ? (
              <p className="text-gray-400">No cars found.</p>
            ) : (
              paginatedCars.map((car) => <CarCard key={car._id} car={car} />)
            )}
          </div>

          {/* PAGINATION */}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12 text-white">
              <button
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
                className="px-4 py-2 border border-gray-700 rounded hover:bg-[#c6a96b]/20 disabled:opacity-30"
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
                      : "border-gray-700 hover:bg-[#c6a96b]/20"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
                className="px-4 py-2 border border-gray-700 rounded hover:bg-[#c6a96b]/20 disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cars;
