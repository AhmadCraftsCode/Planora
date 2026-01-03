const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
  // If custom, agentId can be the Customer's ID or null. We will use Customer ID.
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // New Flag
  isCustom: { type: Boolean, default: false }, 

  title: { type: String, required: true },
  destination: { type: String, required: true },
  duration: { type: Number, required: true },
  seats: { type: Number, required: true }, 
  startDate: { type: Date, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  images: [String], 

  itinerary: [{
    day: Number,
    activity: String
  }],

  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
  guideId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

}, { timestamps: true });

module.exports = mongoose.model("Package", PackageSchema);