import React, { useEffect, useState } from "react";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/useAppContext.js";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";

const ManageBookings = () => {
  const { currency, axios, user } = useAppContext();
  const [bookings, setBookings] = useState([]);

  const fetchOwnerBookings = async () => {
    try {
      const res = await axios.get("/api/booking/owner");
      const payload = res.data;

      if (payload.success) {
        setBookings((payload.bookings || []).filter(Boolean));
      } else {
        toast.error(payload.message || "Failed to fetch bookings");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const changeBookingStatus = async (bookingId, status) => {
    try {
      const res = await axios.post("/api/booking/change-status", {
        bookingId,
        status,
      });
      const payload = res.data;

      if (payload.success) {
        toast.success(payload.message || "Status updated");
        fetchOwnerBookings();
      } else {
        toast.error(payload.message || "Failed to update status");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    const run = async () => {
      await fetchOwnerBookings();
    };
    run();
  }, []);

  const carTitle = (booking) => {
    if (booking?.car) return `${booking.car.brand} ${booking.car.model}`;
    return "Deleted car";
  };

  const safeDate = (iso) => (iso ? iso.split("T")[0] : "—");

  return (
    <div className="px-4 pt-6 md:px-10 flex-1 bg-white text-black">
      {/* TOP BAR */}
      <div className="-mx-4 md:-mx-10 px-4 md:px-10 w-auto flex justify-end items-center mb-6 pt-1 pb-5 border-b border-primary">
        <p className="text-sm text-black">
          Welcome,{" "}
          <span className="text-primary font-semibold">
            {user?.name || "Owner"}
          </span>
        </p>
      </div>

      <div className="pt-0 pb-6 [&_h1]:text-primary [&_*]:text-gray-800 [&_p]:text-gray-600">
        <Title
          title="Manage Bookings"
          subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."
          className="text-primary"
        />
      </div>

      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6 bg-white">
        <table className="w-full border-collapse text-left text-sm text-gray-700">
          {/* HEADER */}
          <thead className="text-primary font-semibold">
            <tr>
              <th className="p-3">Car</th>
              <th className="p-3 max-md:hidden">Date Range</th>
              <th className="p-3">Total</th>
              <th className="p-3 max-md:hidden">Payment</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {(bookings || []).filter(Boolean).map((booking, index) => (
              <tr
                key={booking?._id || index}
                className="border-t border-borderColor text-gray-700"
              >
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={
                      booking?.car?.image ||
                      assets.car_placeholder ||
                      assets.carIconColored
                    }
                    alt=""
                    className="h-12 w-12 aspect-square rounded-md object-cover"
                  />

                  <p className="font-medium text-black max-md:hidden">
                    {carTitle(booking)}
                  </p>
                </td>

                <td className="p-3 max-md:hidden text-gray-700">
                  {safeDate(booking?.pickupDate)} to{" "}
                  {safeDate(booking?.returnDate)}
                </td>

                <td className="p-3 text-black">
                  {currency}
                  {booking?.price ?? 0}
                </td>

                <td className="p-3 max-md:hidden">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                    offline
                  </span>
                </td>

                <td className="p-3">
                  {booking?.status === "pending" ? (
                    <select
                      onChange={(e) =>
                        changeBookingStatus(booking._id, e.target.value)
                      }
                      value={booking.status}
                      className="px-2 py-1.5 mt-1 text-black border border-borderColor rounded-md outline-none bg-white focus:border-primary focus:ring-1 focus:ring-primary/30"
                    >
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="confirmed">Confirmed</option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking?.status === "confirmed"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {booking?.status || "unknown"}
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {(!bookings || bookings.length === 0) && (
              <tr>
                <td className="p-6 text-center text-gray-400" colSpan={5}>
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
