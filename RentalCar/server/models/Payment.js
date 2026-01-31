import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true, // 1 payment po booking-u (kao na dijagramu)
    },

    amount: { type: Number, required: true, min: 0 },

    method: { type: String, enum: ["CARD", "CASH"], default: "CARD" },

    currency: { type: String, enum: ["RSD", "EUR", "USD"], default: "EUR" },

    paymentDate: { type: Date, default: Date.now },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PAID",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
