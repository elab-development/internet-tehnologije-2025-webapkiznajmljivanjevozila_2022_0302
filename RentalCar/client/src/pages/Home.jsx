import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Hero from "../components/Hero";
import FeaturedSection from "../components/FeaturedSection";
import Banner from "../components/Banner";
import Testimonial from "../components/Testimonial";
import Newsletter from "../components/Newsletter";

const Home = () => {
  const navigate = useNavigate();

  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    navigate(
      `/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`,
    );
  };

  return (
    <div>
      <Hero
        pickupLocation={pickupLocation}
        setPickupLocation={setPickupLocation}
        pickupDate={pickupDate}
        setPickupDate={setPickupDate}
        returnDate={returnDate}
        setReturnDate={setReturnDate}
        handleSearch={handleSearch}
      />

      <FeaturedSection />
      <Banner />
      <Testimonial />
      <Newsletter />
    </div>
  );
};

export default Home;
