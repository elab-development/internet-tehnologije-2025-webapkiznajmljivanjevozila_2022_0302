import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Hero from "../components/Hero";
import FeaturedSection from "../components/FeaturedSection";
import Banner from "../components/Banner";
import Testimonial from "../components/Testimonial";
import Newsletter from "../components/Newsletter";
import tornPaper from "../assets/torn-paper.png";
import { useAppContext } from "../context/useAppContext.js";

const Home = () => {
  const navigate = useNavigate();
  const { axios } = useAppContext();

  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [cities, setCities] = useState([]); // 🔥 DODATO

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get("/api/cars");
        const cars = res.data.cars || [];

        const uniqueCities = [
          ...new Set(cars.map((c) => c.location).filter(Boolean)),
        ];

        setCities(uniqueCities);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCities();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    navigate(
      `/cars?location=${encodeURIComponent(pickupLocation)}&pickup=${pickupDate}&return=${returnDate}`,
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
        cities={cities} // 🔥 DODATO
      />

      <FeaturedSection />

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
