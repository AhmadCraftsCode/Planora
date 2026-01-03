const express = require("express");
const { createPackage, getAllPackages, deletePackage, getPackageResources } = require("../controllers/packageController");
const { verifyToken } = require("../middleware");
const router = express.Router();

router.get("/resources", verifyToken, getPackageResources); // Get Hotels/Drivers lists
router.post("/create", verifyToken, createPackage);
router.get("/all", verifyToken, getAllPackages); // Agents see all packages
router.delete("/:id", verifyToken, deletePackage);

module.exports = router;