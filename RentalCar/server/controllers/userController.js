import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Car from "../models/Car.js";
import { logSecurityEvent } from "../services/securityLogger.js";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minuta

//Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

//Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 8) {
        return res.status(400).json({
        success: false,
        message: "Name, email and password are required, and password must be at least 8 characters long.",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      token,
    });
  } catch (error) {
    // error handling
    console.log(error.message);
    return res.status(500).json({
    success: false,
    message: "Server error",
  });
  }
};

//Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    const invalidMessage = {
      success: false,
      message: "Invalid email or password",
    };

    if (!user) {
      await logSecurityEvent({
        event: "LOGIN_FAILED",
        email,
        req,
        status: 401,
        details: "User not found"
      });

  return res.status(401).json(invalidMessage);
}

    if (user.lockUntil && user.lockUntil > new Date()) {
      return res.status(423).json({
        success: false,
        message: "Account is temporarily locked. Please try again later.",
      });
    }

    if (user.lockUntil && user.lockUntil <= new Date()) {
      user.loginAttempts = 0;
      user.lockUntil = null;
      await user.save();
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {

      await logSecurityEvent({
        event: "LOGIN_FAILED",
        email,
        req,
        status: 401,
        details: "Invalid password"
      });

      user.loginAttempts += 1;

      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
        await user.save();

        return res.status(423).json({
          success: false,
          message: "Account is temporarily locked. Please try again later.",
        });
      }

      await user.save();

      return res.status(401).json(invalidMessage);
    }

    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = generateToken(user);

    await logSecurityEvent({
      event: "LOGIN_SUCCESS",
      userId: user._id,
      email: user.email,
      req,
      status: 200
    });

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get User data using Token
export const getUserData = async (req, res) => {
  try {
    const { user } = req;

    return res.status(200).json({
    success: true,
    user,
  });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
    success: false,
    message: "Server error",
  });
  }
};

// Get All Cars for the Frontend
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvailable: true });
    return res.status(200).json({
    success: true,
    cars,
  });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
    success: false,
    message: "Server error",
  });
  }
};
