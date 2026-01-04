const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // 1. ADDED "Guide" TO THE LIST BELOW
  bookingType: { 
    type: String, 
    enum: ["Package", "Hotel", "Driver", "Guide"], // <--- UPDATED
    required: true 
  },
  
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'itemModel' },
  
  // 2. GUIDES ARE PART OF THE 'User' MODEL (Discriminator)
  itemModel: { 
    type: String, 
    required: true, 
    enum: ['Package', 'Hotel', 'User'] // 'User' covers both Driver and Guide
  },

  bookingDate: { type: Date, required: true },
  guests: { type: Number, default: 1 }, 
  days: { type: Number, default: 1 },   
  totalPrice: { type: Number, required: true },
  
  paymentMethod: { type: String, enum: ["Credit/Debit Card", "JazzCash", "Easypaisa"], required: true },
  status: { type: String, default: "Confirmed" }, 

}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);