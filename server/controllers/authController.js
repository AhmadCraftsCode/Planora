const { User, Admin, TravelAgent, HotelManager, Guide, Driver, Customer } = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const { 
      fullName, email, password, phone, address, dob, cnic, gender, role, profilePicture,
      // Specific fields
      qualification, assignedArea, hotelName, language, licenseNumber, city, carName, carModel, pricePerKm
    } = req.body;

    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Define Common Data
    const commonData = {
      fullName, email, password: hashedPassword, phone, address, dob, cnic, gender, profilePicture,
      isApproved: role === "Customer" ? "Approved" : "Pending" // Customers auto-approved, Staff need Admin approval
    };

    let newUser;

    // 4. Create User based on Role
    switch (role) {
      case "TravelAgent":
        newUser = new TravelAgent({ ...commonData, assignedArea });
        break;
      case "HotelManager":
        newUser = new HotelManager({ ...commonData, hotelName });
        break;
      case "Guide":
        newUser = new Guide({ ...commonData, language });
        break;
      case "Driver":
        newUser = new Driver({ ...commonData, licenseNumber, carName, carModel, pricePerKm });
        break;
      case "Customer":
        newUser = new Customer({ ...commonData, city });
        break;
      case "Admin":
         // Only allowing Admin creation via Seed or another Admin (for security)
         return res.status(400).json({ message: "Cannot register as Admin publicly." });
      default:
        return res.status(400).json({ message: "Invalid Role" });
    }

    await newUser.save();
    res.status(201).json({ message: "Registration successful! Please wait for approval." });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN USER (Kept the same)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isApproved === "Pending") return res.status(403).json({ message: "Your account is pending Admin approval." });
    if (user.isApproved === "Rejected") return res.status(403).json({ message: "Your account was rejected by Admin." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, "SECRET_KEY_123", { expiresIn: "1d" });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};