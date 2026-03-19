import React from "react";
import { motion } from "motion/react";

const goldBg = "linear-gradient(135deg, #c6a96b, #b89655, #d4b873)";

const Newsletter = () => {
  return (
    <section className="py-20 px-6 bg-white relative -mb-[1px]">
      {/* GOLD KROVIĆ (POPUNJEN) */}
      <div className="absolute top-0 left-0 w-full h-24 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: goldBg,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 55%, 50% 30%, 0% 55%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative max-w-5xl mx-auto border border-[#c6a96b] rounded-2xl px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-8 bg-dark-soft z-10 mt-14 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        <div className="max-w-md text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-semibold text-white leading-tight">
            Join our premium club
          </h2>

          <p className="text-gray-400 mt-2">
            Get exclusive offers, early vehicle releases and premium discounts.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-5 py-2 rounded-full bg-white text-black outline-none w-full sm:w-64"
          />

          <button className="bg-[#c6a96b] text-white px-6 py-2 rounded-full hover:bg-[#d8b46b] whitespace-nowrap">
            Join Premium
          </button>
        </div>
      </motion.div>

      <div className="h-16" />
    </section>
  );
};

export default Newsletter;
