const express = require("express");
const { loginUser, registerUser } = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser); // New Route
router.post("/login", loginUser);

module.exports = router;