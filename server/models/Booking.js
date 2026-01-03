const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // What is being booked?
  bookingType: { type: String, enum: ["Package", "Hotel", "Driver"], required: true },
  
  // The ID of the specific item (PackageID, HotelID, or UserID for Driver)
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'itemModel' },
  itemModel: { type: String, required: true, enum: ['Package', 'Hotel', 'User'] },

  // Booking Details
  bookingDate: { type: Date, required: true },
  guests: { type: Number, default: 1 }, // For Packages/Hotels
  days: { type: Number, default: 1 },   // For Drivers/Hotels
  totalPrice: { type: Number, required: true },
  
  // Payment Info
  paymentMethod: { type: String, enum: ["Credit/Debit Card", "JazzCash", "Easypaisa"], required: true },
  status: { type: String, default: "Confirmed" }, // Confirmed, Completed, Cancelled

}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);