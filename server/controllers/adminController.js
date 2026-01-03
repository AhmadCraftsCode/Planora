const { User } = require("../models/User");

// Get Users by Role (Admin only)
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params; // e.g., "TravelAgent"
    const users = await User.find({ role }).sort({ createdAt: -1 }); // Newest first
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User Status (Approve/Reject)
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "Approved" or "Rejected"
    
    const user = await User.findByIdAndUpdate(id, { isApproved: status }, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};