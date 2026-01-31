import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema(
  {
    car: { type: ObjectId, ref: "Car", required: true },
    user: { type: ObjectId, ref: "User", required: true },
    owner: { type: ObjectId, ref: "User", required: true },

    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    // tvoj postojeći price ostaje (da ne pukne frontend)
    price: { type: Number, required: true },

    // ✅ DODATO: veza ka Payment modelu (1 payment po booking-u)
    payment: { type: ObjectId, ref: "Payment", default: null },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
