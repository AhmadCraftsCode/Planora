const Package = require("../models/Package");
const Hotel = require("../models/Hotel");
const { User } = require("../models/User");

// 1. Get Homepage Data
exports.getHomeData = async (req, res) => {
  try {
    // 1. Packages: Fetch ALL public packages (REMOVED .limit(3))
    const packages = await Package.find({ isCustom: false })
      .sort({ createdAt: -1 })
      .populate("hotelId", "name city");

    // 2. Hotels: Fetch ALL Hotels (REMOVED .limit(4))
    const hotels = await Hotel.find({});

    // 3. Drivers: Fetch ALL Approved Drivers (REMOVED .limit(3))
    const drivers = await User.find({ role: "Driver", isApproved: "Approved" });
    
    // 4. Guides: Fetch ALL Approved Guides (REMOVED .limit(3))
    const guides = await User.find({ role: "Guide", isApproved: "Approved" });

    // Debugging Log: Check your terminal to see how many it found
    console.log(`Fetching Data: ${packages.length} Packages, ${hotels.length} Hotels, ${drivers.length} Drivers`);

    res.status(200).json({ packages, hotels, drivers, guides });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Search Function
exports.searchItems = async (req, res) => {
  try {
    const { type, location, price } = req.query;
    let results = [];

    if (type === "packages") {
      let query = { isCustom: false };
      if (location) query.destination = { $regex: location, $options: "i" };
      if (price) query.price = { $lte: Number(price) };
      results = await Package.find(query).populate("hotelId", "name city");
    } 
    else if (type === "hotels") {
      let query = {};
      if (location) query.city = { $regex: location, $options: "i" };
      if (price) query.pricePerNight = { $lte: Number(price) };
      results = await Hotel.find(query);
    }
    else if (type === "drivers") {
      let query = { role: "Driver", isApproved: "Approved" };
      if (location) query.address = { $regex: location, $options: "i" };
      if (price) query.pricePerKm = { $lte: Number(price) };
      results = await User.find(query);
    }
    else if (type === "guides") {
      let query = { role: "Guide", isApproved: "Approved" };
      if (location) {
        query.$or = [
          { address: { $regex: location, $options: "i" } },
          { language: { $regex: location, $options: "i" } }
        ];
      }
      if (price) query.pricePerDay = { $lte: Number(price) };
      results = await User.find(query);
    }

    res.status(200).json(results);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};