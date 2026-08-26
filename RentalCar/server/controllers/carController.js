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

export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }
    return res.json({ success: true, car });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
