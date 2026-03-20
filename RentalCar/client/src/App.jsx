import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";

import Home from "./pages/Home";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import MyBookings from "./pages/MyBookings";
import BookingDocuments from "./pages/BookingDocuments";

import Layout from "./pages/owner/Layout";
import Dashboard from "./pages/owner/Dashboard";
import AddCar from "./pages/owner/AddCar";
import ManageCars from "./pages/owner/ManageCars";
import ManageBookings from "./pages/owner/ManageBookings";
import Countries from "./pages/Countries";

import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/useAppContext.js";

import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";

const App = () => {
  const { showLogin } = useAppContext();
  const location = useLocation();

  const isOwnerPath = location.pathname.startsWith("/owner");

  return (
    <>
      <div className="flex flex-col min-h-screen bg-white text-white">
        <ScrollToTop />
        <ScrollToTopButton />

        <Toaster />

        {!isOwnerPath && <Navbar />}

        {showLogin && <Login />}

        {/* KLJUČ */}
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/car-details/:id" element={<CarDetails />} />
            <Route
              path="/booking/:id/documents"
              element={<BookingDocuments />}
            />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/countries" element={<Countries />} />

            <Route path="/owner" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="add-car" element={<AddCar />} />
              <Route path="manage-cars" element={<ManageCars />} />
              <Route path="manage-bookings" element={<ManageBookings />} />
            </Route>
          </Routes>
        </div>

        {!isOwnerPath && <Footer />}
      </div>
    </>
  );
};

export default App;
