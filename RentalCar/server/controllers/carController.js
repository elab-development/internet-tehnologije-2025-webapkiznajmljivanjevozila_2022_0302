import Car from "../models/Car.js";

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
