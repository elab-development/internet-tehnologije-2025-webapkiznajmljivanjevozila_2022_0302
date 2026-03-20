import React from "react";
import Hero from "../components/Hero";
import FeaturedSection from "../components/FeaturedSection";
import Banner from "../components/Banner";
import Testimonial from "../components/Testimonial";
import Newsletter from "../components/Newsletter";
import tornPaper from "../assets/torn-paper.png";

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedSection />
      {/* TORN SEPARATOR */}
      <div className="w-full overflow-hidden">
        <img
          src={tornPaper}
          alt="torn"
          className="w-full h-full object-cover block"
        />
      </div>
      <Banner />
      <Testimonial />
      <Newsletter />
    </div>
  );
};

export default Home;
