import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

/**
 * Dozvola za booking:
 * - korisnik koji je napravio booking (booking.user)
 * - owner automobila (car.owner)
 * - admin (ako imaš)
 */
export const canAccessBooking = async (req, res, next) => {
  try {
    const userId = req.user?._id?.toString();
    const role = req.user?.role;

    // bookingId može doći kao :id ili iz body-a
    const bookingId = req.params.id || req.params.bookingId || req.body.bookingId;

    if (!bookingId) {
      return res.status(400).json({ success: false, message: "bookingId is required" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // admin može sve (ako koristiš admin)
    if (role === "admin") {
      req.booking = booking;
      return next();
    }

    // korisnik vlasnik booking-a
    if (booking.user?.toString() === userId) {
      req.booking = booking;
      return next();
    }

    // owner automobila za taj booking
    const car = await Car.findById(booking.car);
    if (car && car.owner?.toString() === userId) {
      req.booking = booking;
      return next();
    }

    return res.status(403).json({ success: false, message: "Forbidden (IDOR protection)" });
  } catch (error) {
    console.error("canAccessBooking error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
