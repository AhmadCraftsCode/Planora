const express = require("express");
const { getDashboardStats } = require("../controllers/statsController");
const { verifyToken } = require("../middleware");
const router = express.Router();

router.get("/dashboard", verifyToken, getDashboardStats);

module.exports = router;