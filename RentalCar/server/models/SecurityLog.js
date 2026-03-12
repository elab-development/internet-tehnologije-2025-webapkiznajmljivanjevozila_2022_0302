import mongoose from "mongoose";

const securityLogSchema = new mongoose.Schema({
  event: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  ip: String,
  path: String,
  method: String,
  status: Number,
  details: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const SecurityLog = mongoose.model("SecurityLog", securityLogSchema);

export default SecurityLog;