import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import Document from "../models/Document.js";

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

    if (role === "admin") {
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
  } catch (err) {
    console.error("canAccessBooking:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const canAccessDocument = async (req, res, next) => {
  try {
    const userId = req.user?._id?.toString();
    const role = req.user?.role;

    const documentId =
      req.params.id || req.params.documentId || req.body.documentId;

    if (!documentId) {
      return res
        .status(400)
        .json({ success: false, message: "documentId is required" });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }

    if (role === "admin") {
      req.document = document;
      return next();
    }

    if (document.user?.toString() === userId) {
      req.document = document;
      return next();
    }

    return res
      .status(403)
      .json({ success: false, message: "Forbidden (IDOR protection)" });
  } catch (err) {
    console.error("canAccessDocument:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
