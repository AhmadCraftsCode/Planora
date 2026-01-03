const Hotel = require("../models/Hotel");

// Get Hotel Details for the logged-in Manager
exports.getMyHotel = async (req, res) => {
  try {
    // Find hotel linked to this user
    let hotel = await Hotel.findOne({ managerId: req.user.id });
    
    // If no hotel exists yet, return empty/default data structure
    if (!hotel) {
      return res.status(200).json({ 
        name: "", city: "", address: "", description: "", 
        images: { img1: "", img2: "", img3: "" } 
      });
    }
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update (or Create) Hotel Details
exports.updateMyHotel = async (req, res) => {
  try {
    // Add amenities to the destructuring
    const { name, city, address, description, images, pricePerNight, amenities } = req.body;
    
    let hotel = await Hotel.findOneAndUpdate(
      { managerId: req.user.id },
      { name, city, address, description, images, pricePerNight, amenities }, // Save it here
      { new: true, upsert: true }
    );
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};