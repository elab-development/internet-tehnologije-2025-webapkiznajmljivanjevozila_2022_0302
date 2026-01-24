import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import MyBookings from "./pages/MyBookings";
import BookingDocuments from "./pages/BookingDocuments";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();

  const isOwnerPath = location.pathname.startsWith("/owner");
  const isHomePage = location.pathname === "/";

  return (
    <>
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/car-details/:id" element={<CarDetails />} />

        {/* ✅ NOVA RUTA ZA DOKUMENTA */}
        <Route path="/booking/:id/documents" element={<BookingDocuments />} />

        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>

      {!isOwnerPath && !isHomePage && <Footer />}
    </>
  );
};

export default App;
