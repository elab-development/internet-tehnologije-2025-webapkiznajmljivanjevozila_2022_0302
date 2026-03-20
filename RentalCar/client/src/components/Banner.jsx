import React from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";
import tornPaper from "../assets/torn-paper.png";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Banner = () => {
  return (
    <>
      {/* MAIN SECTION */}
      <section className="relative overflow-hidden pb-20 px-6 bg-[#181f18]">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative text-center mb-0"
        >
          <motion.p
            variants={item}
            className="text-white/40 uppercase tracking-[4px] text-xs mb-0"
          >
            Refined Driving Experience
          </motion.p>

          <motion.h1
            variants={item}
            className="text-4xl md:text-6xl font-semibold text-white leading-tight"
          >
            Designed for the
            <span className="text-[#c6a96b]"> road ahead</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-white/60 mt-4 max-w-xl mx-auto text-sm md:text-base"
          >
            A curated selection of vehicles built for comfort,
            <br />
            performance and seamless travel.
          </motion.p>

          <motion.div
            variants={item}
            className="w-24 h-[1px] bg-[#c6a96b]/40 mx-auto mt-6"
          />

          {/* STATS */}
          <motion.div
            variants={item}
            className="flex justify-center gap-10 md:gap-16 mt-8 pb-10 flex-wrap"
          >
            {[
              { value: "500+", label: "Vehicles" },
              { value: "1200+", label: "Clients" },
              { value: "50+", label: "Cities" },
            ].map((stat, i) => (
              <div key={i} className="text-center group transition">
                <p className="text-2xl md:text-3xl font-semibold text-white group-hover:text-[#c6a96b] transition">
                  {stat.value}
                </p>
                <span className="text-white/50 text-xs tracking-wide">
                  {stat.label}
                </span>

                <div className="h-[2px] w-0 bg-[#c6a96b] mx-auto mt-2 group-hover:w-full transition-all duration-300" />
              </div>
            ))}
          </motion.div>
        </motion.div>
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
        {/* BANNER BOX */}
        <div
          className="
            relative overflow-hidden flex flex-col lg:flex-row items-center justify-between
            max-w-7xl mx-auto
            py-16 px-10 gap-12
            bg-[linear-gradient(135deg,#141c14,#1a241a)] 
            border border-[#c6a96b]/20
            rounded-3xl
            shadow-[0_30px_80px_rgba(0,0,0,0.6)]
          "
        >
          {/* TEXTURA */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.18]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  rgba(255,255,255,0.05) 0px,
                  rgba(255,255,255,0.05) 1px,
                  transparent 1px,
                  transparent 4px
                )
              `,
            }}
          />

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl relative z-10"
          >
            <h2 className="text-3xl md:text-5xl font-semibold leading-tight text-white">
              Drive the future of
              <span className="text-[#c6a96b]">
                <br />
                mobility
              </span>
            </h2>

            <p className="text-white/70 mt-6 text-base leading-relaxed">
              Choose from a carefully selected range of vehicles designed for
              comfort, performance and style.
            </p>

            <button
              className="
                mt-8 px-10 py-3
                bg-[#c6a96b]
                text-white
                rounded-full
                hover:bg-[#d8b46b]
                hover:shadow-[0_0_20px_rgba(198,169,107,0.5)]
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
            className="max-h-[320px] lg:max-h-[360px] object-contain relative z-10"
          />
        </div>
      </section>
    </>
  );
};

export default Banner;
