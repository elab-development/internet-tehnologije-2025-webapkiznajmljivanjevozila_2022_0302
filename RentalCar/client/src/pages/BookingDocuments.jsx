import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/useAppContext.js";
import toast from "react-hot-toast";

const BookingDocuments = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { cars, axios, token, setShowLogin } = useAppContext();

  const carFromContext = useMemo(
    () => (Array.isArray(cars) ? cars : []).find((c) => c?._id === id) || null,
    [cars, id],
  );

  const [car, setCar] = useState(carFromContext);

  const [idCardPdf, setIdCardPdf] = useState(null);
  const [passportPdf, setPassportPdf] = useState(null);
  const [licensePdf, setLicensePdf] = useState(null);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CARD");

  const isFormValid = Boolean(passportPdf && licensePdf);

  useEffect(() => {
    setCar(carFromContext);
  }, [carFromContext]);

  const uploadDoc = async (file, documentType) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);

    const { data } = await axios.post("/api/document/upload", formData);

    if (!data?.success) {
      throw new Error(data?.message || "Document upload failed");
    }

    return data.document;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      toast.error("Please login to continue.");
      setShowLogin(true);
      return;
    }

    if (!passportPdf || !licensePdf) {
      setError(
        "Please upload required documents: Passport and Driver’s License.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const pending = JSON.parse(
        localStorage.getItem("pendingBooking") || "null",
      );

      if (!pending || pending.car !== id) {
        toast.error("Missing booking data. Please select dates again.");
        navigate(`/car-details/${id}`);
        return;
      }

      if (idCardPdf) await uploadDoc(idCardPdf, "ID_CARD");
      await uploadDoc(passportPdf, "PASSPORT");
      await uploadDoc(licensePdf, "DRIVING_LICENSE");

      setShowPaymentModal(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      setIsSubmitting(true);

      const pending = JSON.parse(
        localStorage.getItem("pendingBooking") || "null",
      );

      const bookingRes = await axios.post("/api/booking/create", pending);

      const booking = bookingRes?.data?.booking;

      const payRes = await axios.post("/api/payment", {
        bookingId: booking._id,
        amount: booking.price,
        method: paymentMethod,
        currency: "EUR",
      });

      if (!payRes?.data?.success) {
        toast.error(payRes?.data?.message || "Payment failed");
        return;
      }

      toast.success("Booking completed!");

      localStorage.removeItem("pendingBooking");
      setShowPaymentModal(false);

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
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 pt-32 bg-[#0c0f14] min-h-screen">
        <p className="text-gray-400">Car not found.</p>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 pt-32 pb-16 bg-[#0c0f14] min-h-screen">
      {/* BACK BUTTON */}

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-8 text-gray-400 hover:text-[#c6a96b] transition-none"
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-70" />

        <span className="border-b border-transparent hover:border-[#c6a96b]">
          Back
        </span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT SIDE */}

        <div className="lg:col-span-2">
          <img
            src={car.image}
            alt=""
            className="w-full rounded-xl mb-6 shadow-xl"
          />

          <h1 className="text-3xl font-bold text-white">
            {car.brand} {car.model}
          </h1>

          <p className="text-gray-400 text-lg">
            {car.category} • {car.year}
          </p>

          <hr className="border-white/10 my-6" />

          <p className="text-gray-400">
            Please upload your documents in PDF format to proceed with booking.
          </p>
        </div>

        {/* RIGHT FORM */}

        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-md bg-white/5 border border-white/10
          rounded-xl p-6 space-y-6 sticky top-24 h-max text-gray-300"
        >
          <h2 className="text-xl font-semibold text-white">Documents</h2>

          {/* ID CARD */}

          <div className="flex flex-col gap-2">
            <label className="flex justify-between">
              <span>National ID Card (PDF)</span>
              <span className="text-xs text-gray-400">Optional</span>
            </label>

            <input
              type="file"
              accept="application/pdf"
              className="bg-[#0c0f14] border border-white/10 px-3 py-2 rounded-lg"
              onChange={(e) => setIdCardPdf(e.target.files?.[0] ?? null)}
            />

            {idCardPdf && (
              <p className="text-xs text-gray-400">
                Selected: {idCardPdf.name}
              </p>
            )}
          </div>

          {/* PASSPORT */}

          <div className="flex flex-col gap-2">
            <label className="flex justify-between">
              <span>Passport (PDF)</span>
              <span className="text-xs text-red-400">Required</span>
            </label>

            <input
              type="file"
              accept="application/pdf"
              required
              className="bg-[#0c0f14] border border-white/10 px-3 py-2 rounded-lg"
              onChange={(e) => setPassportPdf(e.target.files?.[0] ?? null)}
            />

            {passportPdf && (
              <p className="text-xs text-gray-400">
                Selected: {passportPdf.name}
              </p>
            )}
          </div>

          {/* LICENSE */}

          <div className="flex flex-col gap-2">
            <label className="flex justify-between">
              <span>Driver’s License (PDF)</span>
              <span className="text-xs text-red-400">Required</span>
            </label>

            <input
              type="file"
              accept="application/pdf"
              required
              className="bg-[#0c0f14] border border-white/10 px-3 py-2 rounded-lg"
              onChange={(e) => setLicensePdf(e.target.files?.[0] ?? null)}
            />

            {licensePdf && (
              <p className="text-xs text-gray-400">
                Selected: {licensePdf.name}
              </p>
            )}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full py-3 font-semibold rounded-xl bg-[#c6a96b] text-black disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Book Now"}
          </button>

          <p className="text-center text-sm text-gray-400">
            No credit card required to reserve
          </p>
        </form>
      </div>
    </div>
  );
};

export default BookingDocuments;
