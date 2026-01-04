const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // 1. Allowed booking categories
  bookingType: { 
    type: String, 
    enum: ["Package", "Hotel", "Driver", "Guide"], 
    required: true 
  },
  
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'itemModel' },
  
  // 2. THIS IS THE FIX: Added 'Driver' and 'Guide' to the allowed Models list
  itemModel: { 
    type: String, 
    required: true, 
    enum: ['Package', 'Hotel', 'User', 'Driver', 'Guide'] // <--- UPDATED THIS LINE
  },

  bookingDate: { type: Date, required: true },
  guests: { type: Number, default: 1 }, 
  days: { type: Number, default: 1 },   
  totalPrice: { type: Number, required: true },
  
  paymentMethod: { type: String, enum: ["Credit/Debit Card", "JazzCash", "Easypaisa"], required: true },
  status: { type: String, default: "Confirmed" }, 

}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);