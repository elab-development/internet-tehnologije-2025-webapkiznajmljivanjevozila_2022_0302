import React from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";
import backgroundPhoto from "../assets/background-photo.png";

const Hero = ({
  pickupLocation,
  setPickupLocation,
  pickupDate,
  setPickupDate,
  returnDate,
  setReturnDate,
  handleSearch,
  cities,
}) => {
  return (
    <section className="relative pt-36 pb-28 overflow-hidden">
      {/* BACKGROUND + CLIP */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute top-0 left-[-50%] w-[200%] h-full"
          style={{
            backgroundImage: `url(${backgroundPhoto})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            clipPath: "polygon(-12% 0, 112% 0, 112% 100%, 50% 80%, -12% 100%)",
          }}
        />
      </div>

      {/* GOLD LINE SVG */}
      <svg
        className="absolute bottom-0 left-0 w-full z-5 pointer-events-none translate-y-[-80px]"
        viewBox="0 0 1000 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,200 L500,171 L1000,200"
          fill="none"
          stroke="#c6a96b"
          strokeWidth="1.5"
        />
      </svg>

      {/* glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="
          absolute right-24 top-20
          w-[700px] h-[450px]
          bg-[radial-gradient(circle_at_center,rgba(198,169,107,0.25),transparent_70%)]
          blur-3xl
          "
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* TEXT */}
        <div className="relative z-20">
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
            gap-3
            max-w-xl
            backdrop-blur-2xl
            bg-white/10
            border border-white/20
            p-5
            rounded-2xl
            relative
            z-30
            "
          >
            <select
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="px-4 py-3 rounded-md bg-white text-black"
            >
              <option value="">Pickup location</option>
              {cities?.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="px-4 py-3 rounded-md bg-white text-black"
            />

            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="px-4 py-3 rounded-md bg-white text-black"
            />

            <button className="col-span-3 bg-[#c6a96b] text-white py-3 rounded-full hover:bg-[#d8b46b] transition">
              Search vehicles
            </button>
          </motion.form>
        </div>

        {/* AUTO */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="relative md:-ml-20 z-10 translate-y-4 md:translate-y-16"
        >
          <img
            src={assets.main_car}
            alt="car"
            className="
              w-full
              max-w-[750px]
              ml-auto
              scale-110 md:scale-125
              origin-bottom-left
              relative md:-mb-20
            "
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
