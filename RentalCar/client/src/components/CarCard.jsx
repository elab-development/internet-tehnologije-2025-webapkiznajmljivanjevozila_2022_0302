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
      rounded-xl
      overflow-hidden
      backdrop-blur-lg
      bg-white/5
      border border-white/10
      hover:border-[#c6a96b]
      hover:shadow-[0_0_30px_rgba(198,169,107,0.25)]
      transition
      cursor-pointer
      h-fit
      "
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.image}
          alt="car"
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />

        {car.isAvailable && (
          <p className="absolute top-4 left-4 px-3 py-1 text-xs rounded-full border border-[#c6a96b] bg-black/60 text-white">
            Available
          </p>
        )}

        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur border border-[#c6a96b] px-3 py-2 rounded-lg text-white">
          <span className="font-semibold">
            {loading ? "..." : convertedPrice.toFixed(2)}
          </span>

          <span className="text-sm ml-1 text-gray-300">
            {selectedCurrency}/day
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-medium text-white min-h-[28px]">
          {car.brand} {car.model}
        </h3>

        <div className="w-10 h-[2px] bg-[#c6a96b] mt-2 mb-3"></div>

        <p className="text-sm text-gray-400">
          {car.category} • {car.year}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-y-3 text-gray-400 text-sm">
          <div className="flex items-center">
            <img src={assets.users_icon} className="h-4 mr-2" />
            {car.seating_capacity} Seats
          </div>

          <div className="flex items-center">
            <img src={assets.fuel_icon} className="h-4 mr-2" />
            {car.fuel_type}
          </div>

          <div className="flex items-center">
            <img src={assets.car_icon} className="h-4 mr-2" />
            {car.transmission}
          </div>

          <div className="flex items-center">
            <img src={assets.location_icon} className="h-4 mr-2" />
            {car.location}
          </div>
        </div>

        <div className="mt-4">
          <CountryBadge country={country} />
        </div>
      </div>
    </div>
  );
};

export default CarCard;
