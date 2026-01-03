const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { Admin } = require("./models/User"); // Import the Admin model

dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected for Seeding"))
  .catch((err) => console.log(err));

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: "admin@planora.com" });
    if (existingAdmin) {
      console.log("Admin already exists!");
      process.exit();
    }

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    // Create the Admin object
    const newAdmin = new Admin({
      fullName: "Super Admin",
      email: "admin@planora.com",
      password: hashedPassword,
      phone: "+92 300 1234567",
      address: "Planora Head Office, Islamabad",
      dob: new Date("1990-01-01"),
      cnic: "35202-1234567-1",
      gender: "Male",
      profilePicture: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", // Dummy placeholder
      isApproved: "Approved", // Admin is always approved
      qualification: "Masters in Computer Science" // Specific to Admin
    });

    await newAdmin.save();
    console.log("✅ Admin Created Successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

seedAdmin();