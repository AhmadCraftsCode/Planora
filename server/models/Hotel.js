const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema({
  managerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, default: "No description provided." },

  amenities: { type: [String], default: [] }, 
  
  // We store 3 images as URLs
  images: {
    img1: { type: String, default: "" },
    img2: { type: String, default: "" },
    img3: { type: String, default: "" },
  },
  
  // Placeholder for future features
  pricePerNight: { type: Number, default: 0 },
  availableRooms: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Hotel", HotelSchema);