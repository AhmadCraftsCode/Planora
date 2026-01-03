const Booking = require("../models/Booking");
const Package = require("../models/Package");
const Hotel = require("../models/Hotel");
const { User } = require("../models/User");

// 1. Create a Booking (Standard)
exports.createBooking = async (req, res) => {
  try {
    const { bookingType, itemId, guests } = req.body;

    if (bookingType === "Package") {
      const pkg = await Package.findById(itemId);
      const currentBookings = await Booking.find({ itemId, bookingType: "Package", status: { $ne: "Cancelled" } });
      const seatsTaken = currentBookings.reduce((sum, b) => sum + b.guests, 0);

      if (seatsTaken + Number(guests) > pkg.seats) {
        return res.status(400).json({ message: "Not enough seats available!" });
      }
    }

    const newBooking = new Booking({
      ...req.body,
      customerId: req.user.id
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking Confirmed!" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get Customer Bookings
exports.getCustomerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id })
      .populate("itemId")
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get Agent Bookings
exports.getAgentBookings = async (req, res) => {
  try {
    const myPackages = await Package.find({ agentId: req.user.id }).select('_id');
    const packageIds = myPackages.map(p => p._id);

    const bookings = await Booking.find({ 
        itemId: { $in: packageIds }, 
        bookingType: "Package",
        status: { $ne: "Cancelled" } 
      })
      .populate("customerId", "fullName email phone profilePicture")
      .populate("itemId", "title seats duration")
      .sort({ createdAt: -1 });

    const bookingsWithStats = await Promise.all(bookings.map(async (b) => {
      const stats = await Booking.aggregate([
        { $match: { itemId: b.itemId._id, status: { $ne: "Cancelled" } } },
        { $group: { _id: null, totalBooked: { $sum: "$guests" } } }
      ]);
      const totalBooked = stats[0]?.totalBooked || 0;
      const seatsLeft = b.itemId.seats - totalBooked;
      return { ...b.toObject(), seatsLeft: seatsLeft > 0 ? seatsLeft : 0 };
    }));

    res.status(200).json(bookingsWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Get Service Provider Bookings
exports.getServiceBookings = async (req, res) => {
  try {
    let directQuery = {};
    let myResourceIds = []; 

    if (req.user.role === "Driver") {
      directQuery = { itemId: req.user.id, bookingType: "Driver", status: { $ne: "Cancelled" } };
      const myPackages = await Package.find({ driverId: req.user.id });
      myResourceIds = myPackages.map(p => p._id);

    } else if (req.user.role === "Guide") {
      directQuery = { itemId: req.user.id, bookingType: "Guide", status: { $ne: "Cancelled" } };
      const myPackages = await Package.find({ guideId: req.user.id });
      myResourceIds = myPackages.map(p => p._id);

    } else if (req.user.role === "HotelManager") {
      const myHotel = await Hotel.findOne({ managerId: req.user.id });
      if (!myHotel) return res.status(200).json([]); 
      directQuery = { itemId: myHotel._id, bookingType: "Hotel", status: { $ne: "Cancelled" } };
      const myPackages = await Package.find({ hotelId: myHotel._id });
      myResourceIds = myPackages.map(p => p._id);
    }

    const directBookings = await Booking.find(directQuery)
      .populate("customerId", "fullName phone email")
      .lean();

    const packageBookings = await Booking.find({ 
        bookingType: "Package", 
        itemId: { $in: myResourceIds },
        status: { $ne: "Cancelled" }
      })
      .populate("customerId", "fullName phone email")
      .populate("itemId", "title")
      .lean();

    const directLabeled = directBookings.map(b => ({ ...b, origin: "Direct" }));
    const packageLabeled = packageBookings.map(b => ({ ...b, origin: "Package", packageName: b.itemId.title }));

    const allBookings = [...directLabeled, ...packageLabeled].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(allBookings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Admin View
exports.getAllPackageBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ bookingType: "Package" })
      .populate("customerId", "fullName email phone")
      .populate("itemId", "title")
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.customerId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking Cancelled", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 7. Delete Booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Not found" });

    if (booking.customerId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Booking removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 8. Create Custom Package & Booking
exports.createCustomBooking = async (req, res) => {
  try {
    const { 
      title, destination, duration, startDate, 
      hotelId, driverId, guideId, 
      paymentMethod 
    } = req.body;

    let totalPrice = 0;

    if (hotelId) {
      const hotel = await Hotel.findById(hotelId);
      totalPrice += (hotel.pricePerNight * duration);
    }
    if (driverId) {
      const driver = await User.findById(driverId);
      const dailyDistance = 250; 
      totalPrice += (driver.pricePerKm * dailyDistance * duration);
    }
    if (guideId) {
      totalPrice += (3000 * duration); 
    }

    totalPrice = Math.round(totalPrice * 1.10);

    const newPackage = new Package({
      agentId: req.user.id,
      isCustom: true,
      title, destination, duration, seats: 1, startDate,
      price: totalPrice,
      description: `Custom package created by ${req.user.id}`,
      images: ["https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"],
      hotelId, driverId, guideId,
      itinerary: []
    });

    const savedPackage = await newPackage.save();

    const newBooking = new Booking({
      customerId: req.user.id,
      bookingType: "Package",
      itemId: savedPackage._id,
      itemModel: "Package",
      bookingDate: startDate,
      guests: 1,
      totalPrice: totalPrice,
      paymentMethod: paymentMethod,
      status: "Confirmed"
    });

    await newBooking.save();
    res.status(201).json({ message: "Custom Package Booked!", package: savedPackage });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};