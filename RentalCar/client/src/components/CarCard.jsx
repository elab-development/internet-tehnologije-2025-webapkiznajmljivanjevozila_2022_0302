import React, { useMemo } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import useConvertedPrice from "../hooks/useConvertedPrice";
import { useAppContext } from "../context/useAppContext.js";
import { findCountryByLocation } from "../utils/countryUtils";
import CountryBadge from "./CountryBadge";

const CarCard = ({ car }) => {
  const navigate = useNavigate();
  const { selectedCurrency, countries } = useAppContext();

  const { value: convertedPrice, loading } = useConvertedPrice(
    car?.pricePerDay,
  );

  const country = useMemo(
    () => findCountryByLocation(countries, car?.location),
    [countries, car?.location],
  );

  return (
    <div
      onClick={() => {
        navigate(`/car-details/${car._id}`);
        window.scrollTo(0, 0);
      }}
      className="
        group
        rounded-2xl
        overflow-hidden
        bg-white
        border border-[#c6a96b]/20
        hover:border-[#c6a96b]/50
        shadow-sm
        hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)]
        hover:-translate-y-1
        transition-all duration-300
        cursor-pointer
        flex flex-col
        h-full
      "
    >
      {/* IMAGE */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.image}
          alt="car"
          className="
            w-full h-full object-cover
            group-hover:scale-110
            transition duration-500
          "
        />

        {car.isAvailable && (
          <p
            className="
            absolute top-4 left-4
            px-3 py-1 text-xs rounded-full
            bg-white/90 text-[#1a1f1a]
            border border-[#c6a96b]
          "
          >
            Available
          </p>
        )}

        <div
          className="
          absolute bottom-4 right-4
          bg-[#1a1f1a]
          text-white
          px-3 py-2 rounded-lg
          border border-[#c6a96b]
          shadow-md
        "
        >
          <span className="font-semibold">
            {loading ? "..." : convertedPrice.toFixed(2)}
          </span>

          <span className="text-sm ml-1 text-gray-300">
            {selectedCurrency}/day
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1">
        {/* TITLE */}
        <h3
          className="
          text-lg font-semibold text-[#1a1f1a]
          line-clamp-2
          min-h-[48px]
        "
        >
          {car.brand} {car.model}
        </h3>

        <div className="w-10 h-[2px] bg-[#c6a96b] mt-2 mb-3"></div>

        <p className="text-sm text-gray-600">
          {car.category} • {car.year}
        </p>

        {/* ATTRIBUTES */}
        <div className="mt-4 flex flex-col gap-2 text-gray-600 text-sm">
          <div className="flex items-center">
            <img src={assets.users_icon} className="h-4 mr-2 opacity-70" />
            {car.seating_capacity} Seats
          </div>

          <div className="flex items-center">
            <img src={assets.fuel_icon} className="h-4 mr-2 opacity-70" />
            {car.fuel_type}
          </div>

          <div className="flex items-center">
            <img src={assets.car_icon} className="h-4 mr-2 opacity-70" />
            {car.transmission}
          </div>

          <div className="flex items-center">
            <img src={assets.location_icon} className="h-4 mr-2 opacity-70" />
            {car.location}
          </div>
        </div>

        {/* COUNTRY */}
        <div className="mt-auto pt-2">
          <CountryBadge country={country} />
        </div>
      </div>
    </div>
  );
};

export default CarCard;
