const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { User, Admin, TravelAgent, HotelManager, Guide, Driver, Customer } = require("./models/User");
const Hotel = require("./models/Hotel");
const Package = require("./models/Package");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected for Seeding"))
  .catch((err) => console.log(err));

const seed = async () => {
  try {
    console.log("🧹 Clearing existing data...");
    await User.deleteMany({});
    await Hotel.deleteMany({});
    await Package.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt); // Common password for all

    console.log("🚀 Creating Actors...");

    // --- 1. ADMIN ---
    const admin = await new Admin({
      fullName: "Super Admin", email: "admin@planora.com", password: hashedPassword,
      phone: "0300-1111111", address: "Islamabad HQ", dob: new Date("1990-01-01"),
      cnic: "35202-1111111-1", gender: "Male", isApproved: "Approved",
      qualification: "Masters in CS"
    }).save();

    // --- 2. TRAVEL AGENTS (2 Agents to manage packages) ---
    const agents = [];
    for (let i = 1; i <= 2; i++) {
      agents.push(await new TravelAgent({
        fullName: `Agent ${i}`, email: `agent${i}@planora.com`, password: hashedPassword,
        phone: `0300-222222${i}`, address: "Blue Area, Islamabad", dob: new Date("1992-05-20"),
        cnic: `35202-222222${i}-1`, gender: "Male", isApproved: "Approved",
        assignedArea: "Northern Areas"
      }).save());
    }

    // --- 3. HOTEL MANAGERS (10) ---
    const managers = [];
    const managerNames = ["Ahmed Khan", "Bilal Sheikh", "Chaudhry Riaz", "Dawood Ibrahim", "Eshaal Fatima", "Fahad Mustafa", "Ghulam Rasool", "Hamza Ali", "Imran Nazir", "Junaid Khan"];
    
    for (let i = 0; i < 10; i++) {
      managers.push(await new HotelManager({
        fullName: managerNames[i], email: `manager${i+1}@planora.com`, password: hashedPassword,
        phone: `0300-333333${i}`, address: `Hotel Road, Sector ${i+1}`, dob: new Date("1985-03-10"),
        cnic: `35202-333333${i}-1`, gender: "Male", isApproved: "Approved",
        hotelName: `Planora Hotel ${i+1}` // Placeholder name, real hotel created below
      }).save());
    }

    // --- 4. DRIVERS (10) ---
    const drivers = [];
    const driverData = [
      { name: "Rafiq Ahmed", car: "Toyota Hiace", model: "2018", rate: 60 },
      { name: "Sajjad Ali", car: "Toyota Prado", model: "2020", rate: 120 },
      { name: "Kashif Mehmood", car: "Honda Civic", model: "2022", rate: 50 },
      { name: "Zafar Iqbal", car: "Toyota Coaster", model: "2019", rate: 80 },
      { name: "Nadeem Sarwar", car: "Suzuki APV", model: "2021", rate: 55 },
      { name: "Tariq Jameel", car: "Land Cruiser", model: "2021", rate: 150 },
      { name: "Usman Ghani", car: "Toyota Corolla", model: "2023", rate: 45 },
      { name: "Waseem Akram", car: "Jeep Wrangler", model: "2015", rate: 100 },
      { name: "Yasir Shah", car: "Toyota Fortuner", model: "2022", rate: 110 },
      { name: "Zain Malik", car: "Honda BRV", model: "2020", rate: 60 },
    ];

    for (let i = 0; i < 10; i++) {
      drivers.push(await new Driver({
        fullName: driverData[i].name, email: `driver${i+1}@planora.com`, password: hashedPassword,
        phone: `0300-444444${i}`, address: "Driver Colony, Lahore", dob: new Date("1988-07-22"),
        cnic: `35202-444444${i}-1`, gender: "Male", isApproved: "Approved",
        licenseNumber: `LHR-${1000+i}`, carName: driverData[i].car, carModel: driverData[i].model, pricePerKm: driverData[i].rate
      }).save());
    }

    // --- 5. GUIDES (10) ---
    const guides = [];
    const guideNames = ["Hassan Nisar", "Iqbal Hussain", "Jamal Shah", "Kamran Akmal", "Laila Khan", "Moomal Sheikh", "Noman Ijaz", "Osman Khalid", "Parveen Shakir", "Qasim Ali"];
    
    for (let i = 0; i < 10; i++) {
      guides.push(await new Guide({
        fullName: guideNames[i], email: `guide${i+1}@planora.com`, password: hashedPassword,
        phone: `0300-555555${i}`, address: "Tourist Street, Hunza", dob: new Date("1995-01-15"),
        cnic: `35202-555555${i}-1`, gender: i === 4 || i === 5 ? "Female" : "Male", isApproved: "Approved",
        language: i % 2 === 0 ? "English, Urdu, Pashto" : "Urdu, Punjabi, English",
        pricePerDay: 3000 + (i * 200)
      }).save());
    }

    // --- 6. CUSTOMERS (10) ---
    for (let i = 1; i <= 10; i++) {
      await new Customer({
        fullName: `Customer ${i}`, email: `customer${i}@planora.com`, password: hashedPassword,
        phone: `0300-666666${i}`, address: "Defence Phase 6, Karachi", dob: new Date("1998-11-05"),
        cnic: `35202-666666${i}-1`, gender: i % 2 === 0 ? "Female" : "Male", isApproved: "Approved",
        city: i % 2 === 0 ? "Lahore" : "Karachi"
      }).save();
    }

    console.log("🏨 Creating Hotels...");

    // --- 7. HOTELS (10) ---
    const hotels = [];
    const hotelData = [
      { name: "Pearl Continental", city: "Muzaffarabad", price: 25000, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945" },
      { name: "Serena Hotel", city: "Islamabad", price: 35000, img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb" },
      { name: "Shangrila Resort", city: "Skardu", price: 40000, img: "https://images.unsplash.com/photo-1582719508461-905c673771fd" },
      { name: "Luxus Hunza", city: "Hunza", price: 30000, img: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c" },
      { name: "Pine Top Hotel", city: "Murree", price: 15000, img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4" },
      { name: "Walnut Heights", city: "Kalam", price: 12000, img: "https://images.unsplash.com/photo-1444201983204-c43cbd584d93" },
      { name: "Arcadian Riverside", city: "Naran", price: 18000, img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa" },
      { name: "Hindu Kush Heights", city: "Chitral", price: 20000, img: "https://images.unsplash.com/photo-1560624052-449f5ddf0c31" },
      { name: "Malam Jabba Resort", city: "Swat", price: 28000, img: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6" },
      { name: "Avari Towers", city: "Karachi", price: 22000, img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9" }
    ];

    for (let i = 0; i < 10; i++) {
      hotels.push(await new Hotel({
        managerId: managers[i]._id, // Link to Manager created above
        name: hotelData[i].name,
        city: hotelData[i].city,
        address: "Main Tourist Road",
        description: "Experience luxury and comfort in the heart of the mountains. Free breakfast included.",
        amenities: ["Free Wifi", "Parking", "Restaurant", "Room Service"],
        pricePerNight: hotelData[i].price,
        images: { 
          img1: hotelData[i].img + "?auto=format&fit=crop&w=800&q=80", 
          img2: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80", // Generic Room
          img3: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80"  // Generic Pool/View
        }
      }).save());
    }

    console.log("📦 Creating Packages...");

    // --- 8. PACKAGES (10) ---
    const packageData = [
      { title: "7 Days Hunza & Khunjerab", dest: "Hunza Valley", days: 7, price: 65000, img: "https://images.unsplash.com/photo-1548232979-6c557ee14752" },
      { title: "5 Days Fairy Meadows Trek", dest: "Fairy Meadows", days: 5, price: 45000, img: "https://images.unsplash.com/photo-1627896157732-ca03810486c8" },
      { title: "3 Days Neelum Valley Trip", dest: "Kashmir", days: 3, price: 25000, img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34" },
      { title: "Skardu & Deosai Plains", dest: "Skardu", days: 8, price: 80000, img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1" },
      { title: "Kumrat Valley Camping", dest: "Kumrat", days: 4, price: 30000, img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" },
      { title: "Naran Kaghan & Babusar", dest: "Naran", days: 4, price: 28000, img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b" },
      { title: "Swat & Malam Jabba Ski", dest: "Swat", days: 5, price: 40000, img: "https://images.unsplash.com/photo-1519681393784-d120267933ba" },
      { title: "Ratti Gali Lake Hike", dest: "Kashmir", days: 4, price: 32000, img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800" },
      { title: "Chitral & Kalash Festival", dest: "Chitral", days: 6, price: 55000, img: "https://images.unsplash.com/photo-1530789253388-582c481c54b0" },
      { title: "Murree & Galyat Tour", dest: "Murree", days: 3, price: 20000, img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
    ];

    for (let i = 0; i < 10; i++) {
      const agent = i < 5 ? agents[0] : agents[1]; // Split between 2 agents
      const hotel = hotels[i]; // Assign corresponding hotel
      const driver = drivers[i]; // Assign corresponding driver
      const guide = guides[i]; // Assign corresponding guide

      const itinerary = Array.from({ length: packageData[i].days }, (_, day) => ({
        day: day + 1, 
        activity: `Day ${day+1}: Explore ${packageData[i].dest}, visit local spots, dinner at ${hotel.name}.` 
      }));

      await new Package({
        agentId: agent._id,
        isCustom: false,
        title: packageData[i].title,
        destination: packageData[i].dest,
        duration: packageData[i].days,
        seats: 20,
        startDate: new Date("2026-06-01"), // Future date
        price: packageData[i].price,
        description: `Join us for an amazing journey to ${packageData[i].dest}. Includes transport, hotel stay, and guided tours.`,
        images: [packageData[i].img + "?auto=format&fit=crop&w=800&q=80"],
        hotelId: hotel._id,
        guideId: guide._id,
        driverId: driver._id,
        itinerary: itinerary
      }).save();
    }

    console.log("✅ Database Seeded Successfully!");
    console.log("------------------------------------------------");
    console.log("Admin: admin@planora.com | 123456");
    console.log("Agent: agent1@planora.com | 123456");
    console.log("Manager: manager1@planora.com | 123456");
    console.log("Driver: driver1@planora.com | 123456");
    console.log("Guide: guide1@planora.com | 123456");
    console.log("Customer: customer1@planora.com | 123456");
    console.log("------------------------------------------------");
    
    process.exit();

  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seed();