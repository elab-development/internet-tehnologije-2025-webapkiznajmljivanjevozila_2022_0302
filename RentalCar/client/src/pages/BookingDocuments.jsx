import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const BookingDocuments = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { cars, axios } = useAppContext();

  
  const carFromContext = useMemo(
    () => (Array.isArray(cars) ? cars : []).find((c) => c?._id === id) || null,
    [cars, id],
  );

  const [car, setCar] = useState(carFromContext);

  // Upload state
  const [idCardPdf, setIdCardPdf] = useState(null); 
  const [passportPdf, setPassportPdf] = useState(null); 
  const [licensePdf, setLicensePdf] = useState(null); 

  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const isFormValid = Boolean(passportPdf && licensePdf);

  useEffect(() => {
    if (carFromContext) {
      setCar(carFromContext);
      return;
    }

    (async () => {
      try {
        const { data } = await axios.get(`/api/cars/${id}`);
        if (data?.success && data?.car) {
          setCar(data.car);
        } else {
          setCar(null);
        }
      } catch (e) {
        setCar(null);
      }
    })();
  }, [carFromContext, axios, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!passportPdf || !licensePdf) {
      setError(
        "Please upload required documents: Passport and Driver’s License.",
      );
      return;
    }

    setShowSuccess(true);
  };

  
  const handleConfirm = async () => {
    try {
      
      const pending = JSON.parse(
        localStorage.getItem("pendingBooking") || "null",
      );

      if (!pending || pending.car !== id) {
        toast.error("Missing booking data. Please select dates again.");
        navigate(`/car-details/${id}`);
        return;
      }

      

      
      const { data } = await axios.post("/api/booking/create", pending);

      if (data?.success) {
        toast.success(data.message || "Booking created!");
        localStorage.removeItem("pendingBooking");
        setShowSuccess(false);
        navigate("/my-bookings");
        window.scrollTo(0, 0);
      } else {
        toast.error(data?.message || "Booking failed");
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message);
    }
  };

  if (!car) {
    return (
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
        <p className="text-gray-500">Car not found.</p>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16 relative">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer"
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-65" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left: summary */}
        <div className="lg:col-span-2">
          <img
            src={car.image}
            alt=""
            className="w-full h-auto object-cover rounded-xl mb-6 shadow-md"
          />

          <h1 className="text-3xl font-bold">
            {car.brand} {car.model}
          </h1>
          <p className="text-gray-500 text-lg">
            {car.category} • {car.year}
          </p>

          <hr className="border-borderColor my-6" />

          <p className="text-gray-500">
            Please upload your documents in PDF format to proceed with the
            booking.
          </p>
        </div>

        {/* Right: upload form */}
        <form
          onSubmit={handleSubmit}
          className="shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500"
        >
          <h2 className="text-xl font-semibold text-gray-800">Documents</h2>

          {/* ID card optional */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="id-card"
              className="flex items-center justify-between"
            >
              <span>National ID Card (PDF)</span>
              <span className="text-xs text-gray-400">Optional</span>
            </label>
            <input
              id="id-card"
              type="file"
              accept="application/pdf"
              className="border border-borderColor px-3 py-2 rounded-lg"
              onChange={(e) => setIdCardPdf(e.target.files?.[0] ?? null)}
            />
            {idCardPdf && (
              <p className="text-xs text-gray-400">
                Selected: {idCardPdf.name}
              </p>
            )}
          </div>

          {/* Passport required */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="passport"
              className="flex items-center justify-between"
            >
              <span>Passport (PDF)</span>
              <span className="text-xs text-red-500">Required</span>
            </label>
            <input
              id="passport"
              type="file"
              accept="application/pdf"
              className="border border-borderColor px-3 py-2 rounded-lg"
              required
              onChange={(e) => setPassportPdf(e.target.files?.[0] ?? null)}
            />
            {passportPdf && (
              <p className="text-xs text-gray-400">
                Selected: {passportPdf.name}
              </p>
            )}
          </div>

          {/* Driver's license required */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="license"
              className="flex items-center justify-between"
            >
              <span>Driver’s License (PDF)</span>
              <span className="text-xs text-red-500">Required</span>
            </label>
            <input
              id="license"
              type="file"
              accept="application/pdf"
              className="border border-borderColor px-3 py-2 rounded-lg"
              required
              onChange={(e) => setLicensePdf(e.target.files?.[0] ?? null)}
            />
            {licensePdf && (
              <p className="text-xs text-gray-400">
                Selected: {licensePdf.name}
              </p>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full transition-all py-3 font-medium text-white rounded-xl cursor-pointer
              ${isFormValid ? "bg-primary hover:bg-primary-dull" : "bg-gray-400 cursor-not-allowed"}`}
          >
            Book Now
          </button>

          <p className="text-center text-sm">
            No credit card required to reserve
          </p>
        </form>
      </div>

      {/* Success popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md text-center space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Booking Confirmed
            </h2>
            <p className="text-gray-500">
              Your booking is confirmed! <br />
              Thank you for choosing our car rental service.
            </p>

            <button
              type="button"
              onClick={handleConfirm}
              className="w-full bg-primary hover:bg-primary-dull transition-all py-3 rounded-xl text-white font-medium"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDocuments;
