const express = require("express");
const { loginUser, registerUser, checkUserExists } = require("../controllers/authController"); // <--- FIX HERE
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/check-exists", checkUserExists);

module.exports = router;