import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// API to change role of user
export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, { role: "owner" });

    res.json({
      success: true,
      message: "Now you can list cars",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// API to add Car (ImageKit + memoryStorage)
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;

    let car;
    try {
      car = JSON.parse(req.body.carData);
    } catch {
      return res.status(400).json({ success: false, message: "Invalid carData JSON" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image required" });
    }

    // upload na ImageKit (memoryStorage => buffer)
    const uploadRes = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: `car_${Date.now()}.png`,
      folder: "/cars",
    });

    // optimizovana slika
    const optimizedImageUrl = imagekit.url({
      src: uploadRes.url,
      transformation: [{ width: "1280" }, { quality: "auto" }, { format: "webp" }],
    });

    await Car.create({
      ...car,
      owner: _id,
      image: optimizedImageUrl,
    });

    res.json({ success: true, message: "Car Added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to List Owner Cars
export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id }).sort({ createdAt: -1 });
    res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to Toggle Car Availability
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    // Checking if car belongs to the user
    if (car.owner.toString() !== _id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    res.json({ success: true, message: "Availability Toggled" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to delete car + cancel related bookings
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ success: false, message: "Car not found" });

    if (car.owner.toString() !== _id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await Booking.updateMany(
      { owner: _id, car: carId, status: { $ne: "canceled" } },
      { $set: { status: "canceled" } }
    );

    await Car.findByIdAndDelete(carId);

    return res.json({
      success: true,
      message: "Car Removed. All related bookings canceled.",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// API to get Dashboard Data (KPI + recent + monthly revenue REAL)
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const cars = await Car.find({ owner: _id });
    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    const pendingBookings = await Booking.countDocuments({
      owner: _id,
      status: "pending",
    });

    const completedBookings = await Booking.countDocuments({
      owner: _id,
      status: "confirmed",
    });

    // ✅ pravi "monthly revenue" (tekući mesec)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const revenueAgg = await Booking.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(_id),
          status: "confirmed",
          createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const monthlyRevenue = revenueAgg[0]?.total ?? 0;

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings,
      completedBookings,
      recentBookings: bookings.slice(0, 3),
      monthlyRevenue,
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ API to update user image (multer.memoryStorage)
export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image required",
      });
    }

    const uploadRes = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: `user_${_id}_${Date.now()}.png`,
      folder: "/users",
    });

    const optimizedImageUrl = imagekit.url({
      src: uploadRes.url,
      transformation: [{ width: "400" }, { quality: "auto" }, { format: "webp" }],
    });

    await User.findByIdAndUpdate(_id, { image: optimizedImageUrl });

    return res.json({
      success: true,
      message: "Image Updated",
      image: optimizedImageUrl,
    });
  } catch (err) {
    console.error("updateUserImage error:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Server error",
    });
  }
};

// ✅ NEW: API for charts and advanced dashboard stats
// GET /api/owner/stats?year=2026
export const getOwnerStats = async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (role !== "owner") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const year = Number(req.query.year) || new Date().getFullYear();
    const start = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year + 1, 0, 1));

    const ownerId = new mongoose.Types.ObjectId(_id);

    // 1) bookings by month (count)
    const bookingsByMonth = await Booking.aggregate([
      { $match: { owner: ownerId, createdAt: { $gte: start, $lt: end } } },
      { $group: { _id: { m: { $month: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { "_id.m": 1 } },
    ]);

    // 2) revenue by month (confirmed)
    const revenueByMonth = await Booking.aggregate([
      {
        $match: {
          owner: ownerId,
          status: "confirmed",
          createdAt: { $gte: start, $lt: end },
        },
      },
      { $group: { _id: { m: { $month: "$createdAt" } }, revenue: { $sum: "$price" } } },
      { $sort: { "_id.m": 1 } },
    ]);

    // 3) status breakdown
    const statusBreakdown = await Booking.aggregate([
      { $match: { owner: ownerId, createdAt: { $gte: start, $lt: end } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // 4) top cars by booking count
    const topCars = await Booking.aggregate([
      { $match: { owner: ownerId, createdAt: { $gte: start, $lt: end } } },
      { $group: { _id: "$car", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "cars",
          localField: "_id",
          foreignField: "_id",
          as: "car",
        },
      },
      { $unwind: "$car" },
      {
        $project: {
          _id: 0,
          carId: "$car._id",
          name: { $concat: ["$car.brand", " ", "$car.model"] },
          count: 1,
        },
      },
    ]);

    const fill12 = (arr, key) => {
      const map = new Map(arr.map((x) => [x._id.m, x[key]]));
      return Array.from({ length: 12 }, (_, i) => map.get(i + 1) ?? 0);
    };

    return res.json({
      success: true,
      stats: {
        year,
        bookingsMonthly: fill12(bookingsByMonth, "count"),
        revenueMonthly: fill12(revenueByMonth, "revenue"),
        statusBreakdown: statusBreakdown.map((s) => ({ status: s._id, count: s.count })),
        topCars,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
