import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true })
      .sort({ createdAt: -1 });

    return res.json({ success: true, cars });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAvailableCars = async (req, res) => {
  try {
    const { pickupDate, returnDate, pickupLocation } = req.query;

    let cars = await Car.find({ isAvailable: true });

    // ako nema datuma → vrati sve (kao fallback)
    if (!pickupDate || !returnDate) {
      if (pickupLocation) {
        cars = cars.filter((c) => c.location === pickupLocation);
      }

      return res.json({ success: true, cars });
    }

    // nadji bookings koji se preklapaju
    const conflictingBookings = await Booking.find({
      pickupDate: { $lte: returnDate },
      returnDate: { $gte: pickupDate },
    });

    const bookedCarIds = conflictingBookings.map((b) =>
      b.car.toString()
    );

    cars = cars.filter(
      (c) => !bookedCarIds.includes(c._id.toString())
    );

    if (pickupLocation) {
      cars = cars.filter((c) => c.location === pickupLocation);
    }

    return res.json({ success: true, cars });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};