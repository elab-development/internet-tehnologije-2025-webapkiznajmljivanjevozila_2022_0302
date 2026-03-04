import "dotenv/config";
import bcrypt from "bcrypt";
import connectDB from "../configs/db.js";
import User from "../models/User.js";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || "Admin";

if (!email || !password) {
  console.log("Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env");
  process.exit(1);
}

await connectDB();

const hashed = await bcrypt.hash(password, 10);

const existing = await User.findOne({ email });

if (existing) {
  existing.role = "admin";
  await existing.save();
  console.log(`Updated existing user to ADMIN: ${email}`);
  process.exit(0);
}

await User.create({
  name,
  email,
  password: hashed,
  role: "admin",
});

console.log(`Created ADMIN user: ${email}`);
process.exit(0);