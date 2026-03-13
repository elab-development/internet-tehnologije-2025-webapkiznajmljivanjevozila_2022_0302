import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import CarCard from "./CarCard";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppContext.js";
import { motion } from "motion/react";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const { cars } = useAppContext();

  return (
    <section className="relative w-full text-text-main pt-10 pb-16">
      {/* GOLD AMBIENT LIGHT */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px]
          bg-[radial-gradient(circle_at_center,rgba(198,169,107,0.15),transparent_70%)]
          blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32"
      >
        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl"
        >
          <Title
            title="Featured Vehicles"
            subTitle="Explore our collection of premium vehicles designed for comfort, elegance and performance."
          />
        </motion.div>

        {/* GRID */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10"
        >
          {cars.slice(0, 6).map((car) => (
            <motion.div
              key={car._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </motion.div>

        {/* BUTTON */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => {
            navigate("/cars");
            window.scrollTo(0, 0);
          }}
          className="
          flex items-center justify-center gap-3
          bg-[#c6a96b]
          text-white
          px-14 py-4
          rounded-full
          mt-10
          hover:bg-[#d8b46b]
          transition
          "
        >
          Explore all cars
          <img src={assets.arrow_icon} alt="arrow" className="w-4" />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default FeaturedSection;
