import React from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";

const Banner = () => {
  return (
    <section className="relative text-text-main overflow-hidden py-12">
      {/* GOLD LIGHT */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div
          className="
            absolute right-0 top-0
            w-[900px] h-[500px]
            bg-[radial-gradient(circle_at_center,rgba(198,169,107,0.18),transparent_70%)]
            blur-3xl
            "
        />
      </div>

      <div
        className="relative flex flex-col lg:flex-row items-center justify-between
        max-w-6xl mx-auto
        py-16 px-6 gap-10
        bg-dark-soft border border-gold/20
        rounded-2xl shadow-luxury"
      >
        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <h2 className="text-3xl md:text-5xl font-semibold leading-tight">
            Drive the future of
            <span className="text-[#c6a96b]"> luxury mobility</span>
          </h2>

          <p className="text-gray-400 mt-6">
            Choose from our exclusive fleet of premium vehicles designed for
            comfort, performance and style.
          </p>

          <button
            className="
            mt-8 px-10 py-3
            bg-[#c6a96b]
            text-white
            rounded-full
            hover:bg-[#d8b46b]
            transition
            "
          >
            Join Premium Club
          </button>
        </motion.div>

        {/* IMAGE */}
        <motion.img
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          src={assets.banner_car_image}
          alt="car"
          className="max-h-80 object-contain"
        />
      </div>
    </section>
  );
};

export default Banner;
