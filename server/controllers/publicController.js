const Package = require("../models/Package");
const Hotel = require("../models/Hotel");
const { User } = require("../models/User");

exports.getHomeData = async (req, res) => {
  try {
    // 1. Get Top 3 Packages (EXCLUDING CUSTOM PACKAGES)
    const packages = await Package.find({ isCustom: false }) // <--- FIX ADDED HERE
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("hotelId", "name city");

    // 2. Get Top 4 Hotels
    const hotels = await Hotel.find().limit(4);

    // 3. Get Top 3 Drivers
    const drivers = await User.find({ role: "Driver", isApproved: "Approved" }).limit(3);

    res.status(200).json({ packages, hotels, drivers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search Function
exports.searchItems = async (req, res) => {
  try {
    const { type, location, price } = req.query;
    let results = [];

    // 1. SEARCH PACKAGES
    if (type === "packages") {
      let query = { isCustom: false }; // Only public packages
      
      if (location) query.destination = { $regex: location, $options: "i" }; // Case insensitive matching
      if (price) query.price = { $lte: Number(price) }; // Less than or equal to price

      results = await Package.find(query)
        .populate("hotelId", "name city")
        .sort({ createdAt: -1 });
    }

    // 2. SEARCH HOTELS
    else if (type === "hotels") {
      let query = {};
      
      if (location) query.city = { $regex: location, $options: "i" };
      if (price) query.pricePerNight = { $lte: Number(price) };

      results = await Hotel.find(query);
    }

    // 3. SEARCH DRIVERS
    else if (type === "drivers") {
      let query = { role: "Driver", isApproved: "Approved" };
      
      // Drivers don't have a specific 'city' field in our schema, so we search 'address'
      if (location) query.address = { $regex: location, $options: "i" };
      if (price) query.pricePerKm = { $lte: Number(price) };

      results = await User.find(query);
    }

    res.status(200).json(results);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};