import React from "react";
import { motion } from "motion/react";

const Newsletter = () => {
  return (
    <section className="relative pt-44 pb-60 px-4 bg-white -mt-[120px] -mb-[120px] z-0 overflow-visible">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative z-20 max-w-[1000px] w-full mx-auto border border-[#c6a96b] rounded-2xl px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-8 bg-dark-soft -mt-4 shadow-[0_25px_60px_rgba(0,0,0,0.3)]"
      >
        {/* LEFT */}
        <div className="max-w-md text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-semibold text-white leading-tight">
            Join our premium club
          </h2>

          <p className="text-gray-400 mt-2 text-base">
            Get exclusive offers, early vehicle releases and premium discounts.
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-5 py-2.5 rounded-full bg-white text-black outline-none w-full sm:w-64 focus:ring-2 focus:ring-[#c6a96b]"
          />

          <button className="bg-[#c6a96b] text-white px-6 py-2.5 rounded-full hover:bg-[#d8b46b] whitespace-nowrap">
            Join Premium
          </button>
        </div>

        {/* GOLD CONNECTOR */}
        <div className="absolute left-1/2 -bottom-33.5 -translate-x-1/2 flex flex-col items-center">
          {/* LOPTICA */}
          <div className="w-3 h-3 rounded-full bg-[#c6a96b] shadow-[0_0_10px_rgba(198,169,107,0.9)]" />

          {/* LINIJA */}
          <div className="w-[2px] h-32 bg-gradient-to-b from-[#c6a96b] to-transparent opacity-90" />
        </div>
      </motion.div>

      <div className="h-6" />
    </section>
  );
};

export default Newsletter;
