const mongoose = require("mongoose");

const SecurityLogSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },

  email: {
    type: String
  },

  ip: {
    type: String
  },

  endpoint: {
    type: String
  },

  method: {
    type: String
  },

  status: {
    type: Number
  },

  details: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("SecurityLog", SecurityLogSchema);