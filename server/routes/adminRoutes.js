const express = require("express");
const { getUsersByRole, updateUserStatus, deleteUser } = require("../controllers/adminController");
const { verifyToken } = require("../middleware");
const router = express.Router();

// Protect all these routes (Only Admin can access)
// We can add a checkAdmin middleware later, but verifyToken is a good start
router.get("/:role", verifyToken, getUsersByRole);
router.put("/:id/status", verifyToken, updateUserStatus);
router.delete("/:id", verifyToken, deleteUser);

module.exports = router;