import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
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

    if (typeof d === "string" && d.includes("T")) return d.split("T")[0];

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
      className="px-6 md:px-16 lg:px-24 xl:px-32 pt-32 pb-16 text-sm max-w-7xl min-h-screen"
    >
      <Title
        title="My Bookings"
        subTitle="View and manage all your car bookings"
        align="left"
      />

      <div>
        {bookings.map((booking, index) => {
          const price = getPrice(booking);

          return (
            <motion.div
              key={booking?._id ?? index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6
              bg-[#11151c] border border-[#c6a96b]/20
              rounded-xl mt-5 first:mt-12
              hover:scale-[1.01] hover:border-[#c6a96b]/40
              transition-all duration-300"
            >
              {/* CAR IMAGE + INFO */}

              <div className="md:col-span-1">
                <div className="rounded-lg overflow-hidden mb-3 shadow-lg">
                  <img
                    src={booking?.car?.image}
                    alt={`${booking?.car?.brand ?? "Car"} ${
                      booking?.car?.model ?? ""
                    }`}
                    className="w-full aspect-video object-cover hover:scale-105 transition duration-500"
                  />
                </div>

                <p className="text-lg font-semibold text-white">
                  {booking?.car?.brand} {booking?.car?.model}
                </p>

                <p className="text-gray-400">
                  {booking?.car?.year} • {booking?.car?.category} •{" "}
                  {booking?.car?.location}
                </p>
              </div>

              {/* BOOKING INFO */}

              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <p className="px-3 py-1.5 bg-[#0c0f14] text-gray-300 rounded">
                    Booking #{index + 1}
                  </p>

                  <p
                    className={`px-3 py-1 text-xs rounded-full ${
                      booking?.status === "confirmed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {booking?.status ?? "pending"}
                  </p>
                </div>

                {/* RENTAL PERIOD */}

                <div className="flex items-start gap-2 mt-3">
                  <img
                    src={assets.calendar_icon_colored}
                    alt=""
                    className="w-4 h-4 mt-1 opacity-90"
                  />

                  <div>
                    <p className="text-gray-400">Rental Period</p>

                    <p className="text-white">
                      {formatDate(booking?.pickupDate)} —{" "}
                      {formatDate(booking?.returnDate)}
                    </p>
                  </div>
                </div>

                {/* LOCATION */}

                <div className="flex items-start gap-2 mt-4">
                  <img
                    src={assets.location_icon_colored}
                    alt=""
                    className="w-4 h-4 mt-1 opacity-90"
                  />

                  <div>
                    <p className="text-gray-400">Pick-up Location</p>

                    <p className="text-white">
                      {booking?.car?.location ?? "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* PRICE */}

              <div className="md:col-span-1 flex flex-col justify-between gap-6">
                <div className="text-right">
                  <p className="text-gray-400">Total Price</p>

                  <h1 className="text-2xl font-bold text-[#c6a96b]">
                    {currency}
                    {price}
                  </h1>

                  <p className="text-gray-500 mt-1 text-sm">
                    Booked on {formatDate(booking?.createdAt)}
                  </p>
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
