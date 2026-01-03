const { User, Admin, TravelAgent, HotelManager, Guide, Driver, Customer } = require("../models/User");

// Helper: Case-Insensitive Model Selection
const getModelByRole = (role) => {
  const normalizedRole = role.toLowerCase(); // Convert to lowercase to be safe
  
  if (normalizedRole === "admin") return Admin;
  if (normalizedRole === "travelagent") return TravelAgent;
  if (normalizedRole === "hotelmanager") return HotelManager;
  if (normalizedRole === "guide") return Guide;
  if (normalizedRole === "driver") return Driver;
  if (normalizedRole === "customer") return Customer;
  
  return User; // Default fallback
};

// Get Profile
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Profile (Debug Version)
exports.updateProfile = async (req, res) => {
  try {
    console.log("--- UPDATE PROFILE ATTEMPT ---");
    console.log("1. User Role form Token:", req.user.role);
    console.log("2. Data received:", req.body);

    const updates = req.body;

    // Security Cleanup
    delete updates.password;
    delete updates.email;
    delete updates._id;
    delete updates.role;

    // 1. Select the correct Model
    const SpecificModel = getModelByRole(req.user.role);
    console.log("3. Model Selected:", SpecificModel.modelName);

    // 2. Update using that Specific Model
    // We use $set to explicitly tell MongoDB to update these fields
    const updatedUser = await SpecificModel.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    console.log("4. Updated Data in DB:", updatedUser);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: error.message });
  }
};