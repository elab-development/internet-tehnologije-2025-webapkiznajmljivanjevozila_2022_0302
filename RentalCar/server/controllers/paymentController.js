import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";

export const createPayment = async (req, res) => {
  try {
    const { bookingId, amount, method, currency } = req.body;

    if (!bookingId || amount == null) {
      return res
        .status(400)
        .json({ success: false, message: "bookingId and amount are required" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // ✅ samo korisnik koji je napravio booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    // ✅ ako već postoji payment vezan za booking, ne kreiraj novi
    // (ako želiš update umesto error-a, reci pa ću ti prepraviti)
    if (booking.payment) {
      const existing = await Payment.findById(booking.payment);
      return res.status(409).json({
        success: false,
        message: "Payment already exists for this booking",
        payment: existing,
      });
    }

    // ✅ normalizuj method (dolazi sa fronta "cash/card" ili "CASH/CARD")
    const normalizedMethod = (method || "CARD").toString().toUpperCase();

    // ✅ status logika: card = paid, cash = pending
    const status = normalizedMethod === "CASH" ? "PENDING" : "PAID";

    const payment = await Payment.create({
      booking: bookingId,
      amount,
      method: normalizedMethod,      // "CARD" | "CASH"
      currency: (currency || "EUR").toString().toUpperCase(),
      status,                        // "PAID" | "PENDING"
    });

    // ✅ veži payment za booking
    booking.payment = payment._id;

    // (opciono) ako imaš booking.isPaid ili booking.paymentStatus
    // booking.isPaid = status === "PAID";
    // booking.paymentStatus = status;

    await booking.save();

    return res.json({ success: true, message: "Payment created", payment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
