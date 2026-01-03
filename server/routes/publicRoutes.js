const express = require("express");
const { getHomeData, searchItems } = require("../controllers/publicController");
const router = express.Router();

// 1. Get Homepage Data (Packages, Hotels, Drivers)
router.get("/home-data", getHomeData);

// 2. Search API
router.get("/search", searchItems);

module.exports = router;