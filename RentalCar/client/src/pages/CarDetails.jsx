import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Loader from "../components/Loader";
import { useAppContext } from "../context/useAppContext.js";
import toast from "react-hot-toast";
import { motion } from "motion/react";
import useConvertedPrice from "../hooks/useConvertedPrice";
import { findCountryByLocation } from "../utils/countryUtils";
import CountryBadge from "../components/CountryBadge";

const CarDetails = () => {
  const { id } = useParams();
  const {
    cars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    selectedCurrency,
    countries,
  } = useAppContext();

  const navigate = useNavigate();

  const car = useMemo(() => {
    if (!Array.isArray(cars)) return null;
    return cars.find((c) => c?._id === id) || null;
  }, [cars, id]);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const { value: convertedPrice, loading } = useConvertedPrice(
    car?.pricePerDay,
  );

  useEffect(() => {
    setPickupDate("");
    setReturnDate("");
  }, [id, setPickupDate, setReturnDate]);

  const country = useMemo(
    () => findCountryByLocation(countries, car?.location),
    [countries, car?.location],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pickupDate || !returnDate) {
      toast.error("Please select pickup and return date.");
      return;
    }

    if (returnDate < pickupDate) {
      toast.error("Return date cannot be before pickup date.");
      return;
    }

    localStorage.setItem(
      "pendingBooking",
      JSON.stringify({ car: id, pickupDate, returnDate }),
    );

    navigate(`/booking/${id}/documents`);
  };

  if (!car) return <Loader />;

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 pt-32 pb-40 bg-[#0c0f14] h-full">
      {/* BACK BUTTON */}

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-8
          text-gray-400 hover:text-[#c6a96b]
            border border-[#c6a96b]
            px-4 py-2 rounded-lg
            transition hover:text-[#c6a96b]"
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-70" />

        <span className="border-b border-transparent hover:border-[#c6a96b]">
          Back to all cars
        </span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
        {/* LEFT SECTION */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2"
        >
          <motion.img
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={car.image}
            alt=""
            className="w-full object-cover rounded-xl mb-6 shadow-xl"
          />

          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {car.brand} {car.model}
              </h1>

              <p className="text-gray-400 text-lg">
                {car.category} • {car.year}
              </p>
            </div>

            <CountryBadge country={country} />
          </div>

          <hr className="border-white/10 my-6" />

          {/* CAR SPECS */}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                icon: assets.users_icon,
                text: `${car.seating_capacity} Seats`,
              },
              { icon: assets.fuel_icon, text: car.fuel_type },
              { icon: assets.car_icon, text: car.transmission },
              { icon: assets.location_icon, text: car.location },
            ].map(({ icon, text }) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center bg-[#11151c] border border-[#c6a96b]/20 p-4 rounded-lg"
              >
                <img src={icon} alt="" className="h-5 mb-2 opacity-90" />
                <span className="text-gray-300 text-sm">{text}</span>
              </motion.div>
            ))}
          </div>

          {/* DESCRIPTION */}

          <div className="mt-8">
            <h1 className="text-xl font-medium mb-3 text-white">Description</h1>

            <p className="text-gray-400 leading-relaxed">{car.description}</p>
          </div>
        </motion.div>

        {/* BOOKING PANEL */}

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="sticky top-24 h-max rounded-xl p-7 space-y-6
          backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl"
        >
          {/* PRICE */}

          <p className="flex items-center justify-between text-2xl font-semibold text-white">
            {loading ? "..." : convertedPrice.toFixed(2)} {selectedCurrency}
            <span className="text-base text-white/70 font-normal">per day</span>
          </p>

          <hr className="border-white/10" />

          {/* PICKUP DATE */}

          <div className="flex flex-col gap-2">
            <label className="text-gray-300">Pickup Date</label>

            <input
              type="date"
              value={pickupDate}
              min={today}
              required
              onChange={(e) => setPickupDate(e.target.value)}
              className="bg-[#0c0f14] border border-white/10 px-3 py-2 rounded-lg text-white
              focus:outline-none focus:border-[#c6a96b]"
            />
          </div>

          {/* RETURN DATE */}

          <div className="flex flex-col gap-2">
            <label className="text-gray-300">Return Date</label>

            <input
              type="date"
              value={returnDate}
              min={pickupDate || today}
              required
              onChange={(e) => setReturnDate(e.target.value)}
              className="bg-[#0c0f14] border border-white/10 px-3 py-2 rounded-lg text-white
              focus:outline-none focus:border-[#c6a96b]"
            />
          </div>

          {/* BOOK BUTTON */}

          <button
            type="submit"
            className="w-full bg-[#c6a96b] hover:bg-[#b89a5f] transition-all py-3
            font-semibold text-black rounded-xl cursor-pointer"
          >
            Book Now
          </button>

          <p className="text-center text-sm text-gray-400">
            No credit card required to reserve
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default CarDetails;
