const Package = require("../models/Package");
const { User } = require("../models/User");
const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");

// 1. Helper: Get Available Resources (Hotels, Guides, Drivers) for Dropdowns
exports.getPackageResources = async (req, res) => {
  try {
    const hotels = await Hotel.find({});
    const guides = await User.find({ role: "Guide", isApproved: "Approved" });
    const drivers = await User.find({ role: "Driver", isApproved: "Approved" });
    
    res.status(200).json({ hotels, guides, drivers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Create Package
exports.createPackage = async (req, res) => {
  try {
    const newPackage = new Package({
      ...req.body,
      agentId: req.user.id // Link to the creator
    });
    await newPackage.save();
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get All Packages
exports.getAllPackages = async (req, res) => {
  try {
    // Populate shows the actual names instead of just IDs
    const packages = await Package.find()
      .populate("hotelId", "name city")
      .populate("guideId", "fullName language")
      .populate("driverId", "fullName licenseNumber")
      .sort({ createdAt: -1 });
      
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Delete Package (AND Associated Bookings)
exports.deletePackage = async (req, res) => {
  try {
    const packageId = req.params.id;

    // 1. Delete all bookings associated with this package
    await Booking.deleteMany({ itemId: packageId, bookingType: "Package" });

    // 2. Delete the package itself
    await Package.findByIdAndDelete(packageId);

    res.status(200).json({ message: "Package and associated bookings deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};