import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

export const canAccessBooking = async (req, res, next) => {
  try {
    const userId = req.user?._id?.toString();
    const role = req.user?.role;

    const bookingId =
      req.params.id || req.params.bookingId || req.body.bookingId;

    if (!bookingId) {
      return res
        .status(400)
        .json({ success: false, message: "bookingId is required" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (role === "owner") {
      req.booking = booking;
      return next();
    }

    if (booking.user?.toString() === userId) {
      req.booking = booking;
      return next();
    }

    const car = await Car.findById(booking.car);
    if (car && car.owner?.toString() === userId) {
      req.booking = booking;
      return next();
    }

    return res
      .status(403)
      .json({ success: false, message: "Forbidden (IDOR protection)" });
  } catch (error) {
    console.error("canAccessBooking error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
