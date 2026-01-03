const express = require("express");
const { getMyProfile, updateProfile } = require("../controllers/userController");
const { verifyToken } = require("../middleware"); // Protect these routes
const router = express.Router();

// Use verifyToken to ensure only logged-in users can access
router.get("/profile", verifyToken, getMyProfile);
router.put("/profile/update", verifyToken, updateProfile);

module.exports = router;