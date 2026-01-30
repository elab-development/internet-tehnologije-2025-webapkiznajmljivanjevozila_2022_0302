import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// Helper: safe Date cast
const toDate = (value) => {
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

// Function to Check Availability of a Car for a given Date range
const checkAvailability = async (carId, pickupDate, returnDate) => {
  const pick = pickupDate instanceof Date ? pickupDate : toDate(pickupDate);
  const ret = returnDate instanceof Date ? returnDate : toDate(returnDate);

  if (!pick || !ret) return false;

  const bookings = await Booking.find({
    car: carId,
    pickupDate: { $lte: ret },
    returnDate: { $gte: pick },
  });

  return bookings.length === 0;
};

// ✅ API: Check Availability of Cars for given date + pickupLocation (URL param name required)
export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { pickupLocation, location, pickupDate, returnDate } = req.body;

    // accept both keys, but you said pickupLocation must exist
    const loc = (pickupLocation || location || "").trim();

    if (!loc || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: "pickupLocation, pickupDate and returnDate are required",
      });
    }

    const pick = toDate(pickupDate);
    const ret = toDate(returnDate);

    if (!pick || !ret) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickupDate or returnDate",
      });
    }

    if (pick > ret) {
      return res.status(400).json({
        success: false,
        message: "pickupDate must be before returnDate",
      });
    }

    // ✅ Find cars by location (case-insensitive exact match) + only isAvailable true
    const cars = await Car.find({
      location: { $regex: new RegExp(`^${loc}$`, "i") },
      isAvailable: true,
    });

    const availableCarsPromises = cars.map(async (car) => {
      const free = await checkAvailability(car._id, pick, ret);
      return { ...car._doc, isAvailable: free };
    });

    let availableCars = await Promise.all(availableCarsPromises);
    availableCars = availableCars.filter((c) => c.isAvailable === true);

    return res.json({ success: true, availableCars });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ API to Create Booking
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    if (!car || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: "car, pickupDate and returnDate are required",
      });
    }

    const pick = toDate(pickupDate);
    const ret = toDate(returnDate);

    if (!pick || !ret) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickupDate or returnDate",
      });
    }

    if (pick > ret) {
      return res.status(400).json({
        success: false,
        message: "pickupDate must be before returnDate",
      });
    }

    const isFree = await checkAvailability(car, pick, ret);
    if (!isFree) {
      return res.json({ success: false, message: "Car is not available" });
    }

    const carData = await Car.findById(car);
    if (!carData) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    // Calculate price based on pickupDate and returnDate
    const noOfDays = Math.max(
      1,
      Math.ceil((ret - pick) / (1000 * 60 * 60 * 24))
    );
    const price = (carData.pricePerDay || 0) * noOfDays;

    await Booking.create({
      car,
      owner: carData.owner,
      user: _id,
      pickupDate: pick,
      returnDate: ret,
      price,
    });

    return res.json({ success: true, message: "Booking Created" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ API to List User Bookings
export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;

    const bookings = await Booking.find({ user: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ API to get Owner Bookings
export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({ owner: req.user._id })
      .populate("car user")
      .select("-user.password")
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ API to change booking status
export const changeBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const { bookingId, status } = req.body;

    if (!bookingId || !status) {
      return res.status(400).json({
        success: false,
        message: "bookingId and status are required",
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (booking.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();

    return res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
