import React from "react";
import { assets, cityList } from "../assets/assets";
import { motion } from "motion/react";

const Hero = ({
  pickupLocation,
  setPickupLocation,
  pickupDate,
  setPickupDate,
  returnDate,
  setReturnDate,
  handleSearch,
}) => {
  return (
    <section className="relative pt-36 pb-28 px-6 overflow-visible">
      {/* GOLD GLOW */}

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="
          absolute right-24 top-20
          w-[700px] h-[450px]
          bg-[radial-gradient(circle_at_center,rgba(198,169,107,0.25),transparent_70%)]
          blur-3xl
          "
        />
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative">
        {/* LEFT */}

        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-6xl font-semibold text-white leading-tight"
          >
            Experience the Future of
            <span className="text-[#c6a96b]"> Car Rental</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-6 max-w-md"
          >
            Discover premium vehicles designed for comfort, performance and
            elegance.
          </motion.p>

          {/* SEARCH */}

          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="
            mt-12
            grid
            grid-cols-3
            gap-4
            max-w-2xl
            backdrop-blur-xl
            bg-white/5
            border border-white/10
            p-6
            rounded-2xl
            relative
            z-20
            "
          >
            {/* LOCATION */}

            <select
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="
              px-4 py-3
              rounded-md
              bg-white
              text-black
              "
            >
              <option value="">Pickup location</option>

              {cityList.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>

            {/* PICKUP DATE */}

            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="
              px-4 py-3
              rounded-md
              bg-white
              text-black
              "
            />

            {/* RETURN DATE */}

            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="
              px-4 py-3
              rounded-md
              bg-white
              text-black
              "
            />

            {/* SEARCH BUTTON */}

            <button
              className="
              col-span-3
              bg-[#c6a96b]
              text-white
              py-3
              rounded-full
              hover:bg-[#d8b46b]
              transition
              "
            >
              Search vehicles
            </button>
          </motion.form>
        </div>

        {/* RIGHT */}

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="
          relative
          md:-ml-20
          z-10
          "
        >
          <img
            src={assets.main_car}
            alt="car"
            className="
            w-full
            max-w-[650px]
            ml-auto
            drop-shadow-[0_25px_45px_rgba(0,0,0,0.5)]
            relative
            md:-mb-20
            "
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
