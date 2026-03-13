import React from "react";
import { motion } from "motion/react";

const Newsletter = () => {
  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="
        max-w-5xl
        mx-auto
        border border-[#c6a96b]
        rounded-2xl
        px-10 py-8
        flex flex-col md:flex-row
        items-center
        justify-between
        gap-8
        backdrop-blur-lg
        bg-dark-soft/60
        "
      >
        {/* LEFT */}

        <div className="max-w-md text-center md:text-left">
          <h2 className="text-3xl font-semibold text-white">
            Join our premium club
          </h2>

          <p className="text-gray-400 mt-2">
            Get exclusive offers, early vehicle releases and premium discounts.
          </p>
        </div>

        {/* RIGHT */}

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="
            px-5 py-2
            rounded-full
            bg-white
            text-black
            outline-none
            w-full sm:w-64
            "
          />

          <button
            className="
            bg-[#c6a96b]
            text-white
            px-6 py-2
            rounded-full
            hover:bg-[#d8b46b]
            whitespace-nowrap
            "
          >
            Join Premium
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Newsletter;
