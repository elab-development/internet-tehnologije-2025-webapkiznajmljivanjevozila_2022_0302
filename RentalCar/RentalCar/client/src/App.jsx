import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";   //  DODATO

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

      {/*LOGIN MODAL */}
      {showLogin && <Login setShowLogin={setShowLogin} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/booking/:id/documents" element={<BookingDocuments />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>

      {!isOwnerPath && !isHomePage && <Footer />}
    </>
  );
};

export default App;
