import React, { useEffect, useState } from "react";
import { dummyMyBookingsData, assets } from "../assets/assets";
import Title from "../components/Title";
import { useAppContext } from "../context/useAppContext.js";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const MyBookings = () => {
  const { axios, user, currency } = useAppContext();

  const [bookings, setBookings] = useState([]);

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/booking/user");
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!user) return;

    const run = async () => {
      await fetchMyBookings();
    };

    run();
  }, [user]);

  const formatDate = (d) => {
    if (!d) return "-";
    // ako je ISO string: "2025-06-13T00:00:00.000Z"
    if (typeof d === "string" && d.includes("T")) return d.split("T")[0];
    // ako je vec "2025-06-13"
    return String(d);
  };

  const getPrice = (booking) => {
    const p =
      booking?.price ??
      booking?.totalPrice ??
      booking?.total_amount ??
      booking?.totalAmount ??
      booking?.amount ??
      booking?.total;

    return Number(p ?? 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl"
    >
      <Title
        title="My Bookings"
        subTitle="View and manage your all car bookings"
        align="left"
      />

      <div>
        {bookings.map((booking, index) => {
          const price = getPrice(booking);

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              key={booking?._id ?? index}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12"
            >
              {/* Car Image + Info */}
              <div className="md:col-span-1">
                <div className="rounded-md overflow-hidden mb-3">
                  <img
                    src={booking?.car?.image}
                    alt={`${booking?.car?.brand ?? "Car"} ${booking?.car?.model ?? "Removed"}`}
                    className="w-full h-auto aspect-video object-cover"
                  />
                </div>

                <p className="text-lg font-medium mt-2">
                  {booking?.car?.brand} {booking?.car?.model}
                </p>

                <p className="text-gray-500">
                  {booking?.car?.year} • {booking?.car?.category} •{" "}
                  {booking?.car?.location}
                </p>
              </div>

              {/* Booking Info */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <p className="px-3 py-1.5 bg-light rounded">
                    Booking #{index + 1}
                  </p>

                  <p
                    className={`px-3 py-1 text-xs rounded-full ${
                      booking?.status === "confirmed"
                        ? "bg-green-400/15 text-green-600"
                        : "bg-yellow-400/15 text-yellow-600"
                    }`}
                  >
                    {booking?.status ?? "pending"}
                  </p>
                </div>

                {/* Rental Period */}
                <div className="flex items-start gap-2 mt-3">
                  <img
                    src={assets.calendar_icon_colored}
                    alt=""
                    className="w-4 h-4 mt-1"
                  />
                  <div>
                    <p className="text-gray-500">Rental Period</p>
                    <p>
                      {formatDate(booking?.pickupDate)} To{" "}
                      {formatDate(booking?.returnDate)}
                    </p>
                  </div>
                </div>

                {/* Pick-up Location */}
                <div className="flex items-start gap-2 mt-3">
                  <img
                    src={assets.location_icon_colored}
                    alt=""
                    className="w-4 h-4 mt-1"
                  />
                  <div>
                    <p className="text-gray-500">Pick-up Location</p>
                    <p>{booking?.car?.location ?? "-"}</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="md:col-span-1 flex flex-col justify-between gap-6">
                <div className="text-sm text-gray-500 text-right">
                  <p>Total Price</p>

                  <h1 className="text-2xl font-semibold text-primary">
                    {currency}
                    {price}
                  </h1>

                  <p>Booked on {formatDate(booking?.createdAt)}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MyBookings;
