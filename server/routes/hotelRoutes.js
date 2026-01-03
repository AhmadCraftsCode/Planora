const express = require("express");
const { getMyHotel, updateMyHotel } = require("../controllers/hotelController");
const { verifyToken } = require("../middleware");
const router = express.Router();

router.get("/my-hotel", verifyToken, getMyHotel);
router.put("/update", verifyToken, updateMyHotel);

module.exports = router;