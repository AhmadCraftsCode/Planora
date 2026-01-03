const express = require("express");
const { 
  createBooking, 
  getCustomerBookings, 
  getAgentBookings, 
  getServiceBookings, 
  getAllPackageBookings, 
  cancelBooking,
  deleteBooking,
  createCustomBooking
} = require("../controllers/bookingController");
const { verifyToken } = require("../middleware");

const router = express.Router();

// 1. Create Booking (Standard)
router.post("/create", verifyToken, createBooking);

// 2. Create Custom Booking (Dynamic)
router.post("/custom", verifyToken, createCustomBooking);

// 3. Customer Bookings
router.get("/my-bookings", verifyToken, getCustomerBookings);

// 4. Agent Bookings
router.get("/agent-bookings", verifyToken, getAgentBookings);

// 5. Service Provider Bookings (Driver, Guide, Hotel Manager)
router.get("/service-bookings", verifyToken, getServiceBookings);

// 6. Admin View (All Package Bookings)
router.get("/admin/packages", verifyToken, getAllPackageBookings);

// 7. Cancel Booking (Update Status)
router.put("/cancel/:id", verifyToken, cancelBooking);

// 8. Delete Booking (Remove Permanently)
router.delete("/:id", verifyToken, deleteBooking);

module.exports = router;