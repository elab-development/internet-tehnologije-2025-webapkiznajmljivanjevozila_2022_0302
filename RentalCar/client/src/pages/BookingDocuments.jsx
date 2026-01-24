import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, dummyCarData } from "../assets/assets";

const BookingDocuments = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const car = useMemo(() => dummyCarData.find((c) => c._id === id), [id]);

    const [idCardPdf, setIdCardPdf] = useState(null);      // optional
    const [passportPdf, setPassportPdf] = useState(null);  // required
    const [licensePdf, setLicensePdf] = useState(null);    // required

    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false); // ✅ popup

    const isFormValid = Boolean(passportPdf && licensePdf);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!passportPdf || !licensePdf) {
            setError("Please upload required documents: Passport and Driver’s License.");
            return;
        }

        // ✅ otvori popup (nema alert)
        setShowSuccess(true);
    };

    // ✅ klik na Confirm: snimi auto kao booked + idi na Home
    const handleConfirm = () => {
        if (!car) return;

        const bookedCars = JSON.parse(localStorage.getItem("bookedCars")) || [];

        // da se ne duplira ako neko klikne 2x
        if (!bookedCars.includes(car._id)) {
            bookedCars.push(car._id);
            localStorage.setItem("bookedCars", JSON.stringify(bookedCars));
        }

        setShowSuccess(false);
        navigate("/");
        window.scrollTo(0, 0);
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
                        />
                        {licensePdf && (
                            <p className="text-xs text-gray-400">Selected: {licensePdf.name}</p>
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

            {/* ✅ SUCCESS POPUP */}
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
