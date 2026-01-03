const mongoose = require("mongoose");

// 1. Define the Base Schema (Common Attributes)
// These are attributes shared by EVERYONE (Admin, Customer, Driver, etc.)
const baseOptions = {
  discriminatorKey: "role", // This tells DB to distinguish users based on their role
  collection: "users",      // Store everyone in the 'users' table
  timestamps: true,         // Automatically adds 'createdAt' and 'updatedAt'
};

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Contact & Personal Info
  phone: { type: String, required: true },
  address: { type: String, required: true },
  dob: { type: Date, required: true },
  cnic: { type: String, required: true, unique: true }, // National ID
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  profilePicture: { type: String, default: "" }, // We will store the Image URL here later

  // Account Status (For Admin Approval System)
  isApproved: { 
    type: String, 
    enum: ["Pending", "Approved", "Rejected"], 
    default: "Pending" 
  },
}, baseOptions);

// Create the Base Model
const User = mongoose.model("User", UserSchema);

// ----------------------------------------------------------------
// 2. Define the Specific Schemas (Child Classes)
// These inherit everything from 'User' + add their own specific fields
// ----------------------------------------------------------------

// Admin Actor
const Admin = User.discriminator("Admin", new mongoose.Schema({
  qualification: { type: String, required: true }
}));

// Travel Agent Actor
const TravelAgent = User.discriminator("TravelAgent", new mongoose.Schema({
  assignedArea: { type: String, required: true }
}));

// Hotel Manager Actor
const HotelManager = User.discriminator("HotelManager", new mongoose.Schema({
  hotelName: { type: String, required: true }
}));

// Guide Actor
const Guide = User.discriminator("Guide", new mongoose.Schema({
  language: { type: String, required: true }
}));

// Driver Actor
const Driver = User.discriminator("Driver", new mongoose.Schema({
  licenseNumber: { type: String, required: true },
  carName: { type: String, default: "" }, 
  carModel: { type: String, default: "" }, 
  pricePerKm: { type: Number, default: 0 }  
}));

// Customer Actor
const Customer = User.discriminator("Customer", new mongoose.Schema({
  city: { type: String, required: true }
}));

// Export all models so we can use them in the Controller
module.exports = { 
  User, 
  Admin, 
  TravelAgent, 
  HotelManager, 
  Guide, 
  Driver, 
  Customer 
};