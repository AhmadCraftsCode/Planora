const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const packageRoutes = require("./routes/packageRoutes");
const publicRoutes = require("./routes/publicRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const statsRoutes = require("./routes/statsRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "*", // Allow all origins (Easiest for deployment)
    credentials: true
}));

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};
connectDB();

// Routes
app.use("/api/auth", authRoutes); // Login is at /api/auth/login
app.use("/api/users", userRoutes); // Profile is at /api/users/profile
app.use("/api/admin", adminRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => {
  res.send("Hello! Planora Backend is running perfectly.");
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;