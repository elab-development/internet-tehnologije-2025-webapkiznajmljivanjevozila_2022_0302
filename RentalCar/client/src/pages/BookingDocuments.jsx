import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const BookingDocuments = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { cars, axios, token, setShowLogin } = useAppContext();

  const carFromContext = useMemo(
    () => (Array.isArray(cars) ? cars : []).find((c) => c?._id === id) || null,
    [cars, id]
  );

  const [car, setCar] = useState(carFromContext);

  // Upload state
  const [idCardPdf, setIdCardPdf] = useState(null); // optional
  const [passportPdf, setPassportPdf] = useState(null); // required
  const [licensePdf, setLicensePdf] = useState(null); // required

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = Boolean(passportPdf && licensePdf);

  useEffect(() => {
    setCar(carFromContext);
  }, [carFromContext]);

  // ✅ helper: upload jednog dokumenta
  const uploadDoc = async (file, documentType) => {
    const formData = new FormData();
    formData.append("file", file); // server očekuje field name "file"
    formData.append("documentType", documentType);

    // ✅ NEMOJ ručno Content-Type, axios postavlja boundary sam
    const { data } = await axios.post("/api/document/upload", formData);

    if (!data?.success) {
      throw new Error(data?.message || "Document upload failed");
    }
    return data.document;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ mora biti ulogovan korisnik (upload + booking + payment su protected)
    if (!token) {
      toast.error("Please login to continue.");
      setShowLogin(true);
      return;
    }

    if (!passportPdf || !licensePdf) {
      setError("Please upload required documents: Passport and Driver’s License.");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1) pending booking info iz localStorage
      const pending = JSON.parse(localStorage.getItem("pendingBooking") || "null");

      if (!pending || pending.car !== id) {
        toast.error("Missing booking data. Please select dates again.");
        navigate(`/car-details/${id}`);
        return;
      }

      // 2) Upload dokumenata (ID_CARD optional + PASSPORT + DRIVING_LICENSE required)
      if (idCardPdf) {
        await uploadDoc(idCardPdf, "ID_CARD");
      }
      await uploadDoc(passportPdf, "PASSPORT");
      await uploadDoc(licensePdf, "DRIVING_LICENSE");

      // 3) Create booking
      const bookingRes = await axios.post("/api/booking/create", pending);
      const bookingData = bookingRes?.data;

      if (!bookingData?.success) {
        toast.error(bookingData?.message || "Booking failed");
        return;
      }

      const booking = bookingData.booking;
      const bookingId = booking?._id;

      if (!bookingId) {
        toast.error("Booking created, but booking id is missing.");
        return;
      }

      // 4) Amount: prioritet booking.price, fallback na bookingData.price, pa pending.price
      const amount =
        booking?.price ??
        bookingData?.price ??
        pending?.price;

      if (amount == null) {
        toast.error("Payment amount is missing.");
        return;
      }

      // 5) Create payment
      const payRes = await axios.post("/api/payment", {
        bookingId,
        amount,
        method: "CARD",
        currency: "EUR",
      });

      if (!payRes?.data?.success) {
        toast.error(payRes?.data?.message || "Payment failed");
        return;
      }

      // 6) Cleanup + redirect
      toast.success("Booking completed!");
      localStorage.removeItem("pendingBooking");
      navigate("/my-bookings");
      window.scrollTo(0, 0);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
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
            alt={`${car.brand ?? ""} ${car.model ?? ""}`}
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
            Please upload your documents in PDF format to proceed with the booking.
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
            <label htmlFor="id-card" className="flex items-center justify-between">
              <span>National ID Card (PDF)</span>
              <span className="text-xs text-gray-400">Optional</span>
            </label>
            <input
              id="id-card"
              type="file"
              accept="application/pdf"
              className="border border-borderColor px-3 py-2 rounded-lg"
              onChange={(e) => setIdCardPdf(e.target.files?.[0] ?? null)}
              disabled={isSubmitting}
            />
            {idCardPdf && (
              <p className="text-xs text-gray-400">Selected: {idCardPdf.name}</p>
            )}
          </div>

          {/* Passport required */}
          <div className="flex flex-col gap-2">
            <label htmlFor="passport" className="flex items-center justify-between">
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
              disabled={isSubmitting}
            />
            {passportPdf && (
              <p className="text-xs text-gray-400">Selected: {passportPdf.name}</p>
            )}
          </div>

          {/* Driver's license required */}
          <div className="flex flex-col gap-2">
            <label htmlFor="license" className="flex items-center justify-between">
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
              disabled={isSubmitting}
            />
            {licensePdf && (
              <p className="text-xs text-gray-400">Selected: {licensePdf.name}</p>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full transition-all py-3 font-medium text-white rounded-xl cursor-pointer
              ${
                isFormValid && !isSubmitting
                  ? "bg-primary hover:bg-primary-dull"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            {isSubmitting ? "Processing..." : "Book Now"}
          </button>

          <p className="text-center text-sm">
            No credit card required to reserve
          </p>
        </form>
      </div>
    </div>
  );
};

export default BookingDocuments;
