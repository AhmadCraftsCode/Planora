const Booking = require("../models/Booking");
const Package = require("../models/Package");
const Hotel = require("../models/Hotel");

exports.getDashboardStats = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user.id;

    // 1. PRE-FETCH RESOURCES
    let myResourceIds = []; 
    let myPackagesAsResource = []; 

    if (role === "TravelAgent") {
      const pkgs = await Package.find({ agentId: userId }).select('_id');
      myResourceIds = pkgs.map(p => p._id.toString());
    }
    else if (role === "HotelManager") {
      const hotel = await Hotel.findOne({ managerId: userId }).select('_id');
      if (hotel) {
        myResourceIds.push(hotel._id.toString());
        const pkgs = await Package.find({ hotelId: hotel._id }).select('_id');
        myPackagesAsResource = pkgs.map(p => p._id.toString());
      }
    }
    else if (role === "Driver" || role === "Guide") {
      myResourceIds.push(userId);
      const query = role === "Driver" ? { driverId: userId } : { guideId: userId };
      const pkgs = await Package.find(query).select('_id');
      myPackagesAsResource = pkgs.map(p => p._id.toString());
    }

    // 2. FETCH ACTIVE BOOKINGS
    const allBookings = await Booking.find({ status: { $ne: "Cancelled" } })
      .populate("itemId") 
      .sort({ createdAt: 1 });

    let totalEarnings = 0;
    let totalBookings = 0;
    let monthlyData = {};
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    months.forEach(m => monthlyData[m] = 0);

    // --- STATS CONTAINERS ---
    let adminStats = { packages: 0, customPackages: 0, hotels: 0, drivers: 0, guides: 0 };
    // This container holds the Customer's spending breakdown
    let customerStats = { packages: 0, customPackages: 0, hotels: 0, drivers: 0, guides: 0 }; 

    const addToGraph = (date, amount) => {
      const d = new Date(date);
      if (!isNaN(d)) {
        const month = d.toLocaleString('default', { month: 'short' });
        monthlyData[month] = (monthlyData[month] || 0) + amount;
      }
    };

    // 3. CALCULATION LOOP
    for (const booking of allBookings) {
      if (!booking.itemId) continue;

      const price = booking.totalPrice || 0;
      const type = booking.bookingType; 
      const item = booking.itemId; 
      const itemIdStr = item._id.toString();
      
      let myShare = 0;
      let isMyBooking = false;

      // --- CUSTOMER LOGIC (Expense Breakdown) ---
      if (role === "Customer") {
        if (booking.customerId.toString() === userId) {
          isMyBooking = true;
          myShare = price; // Customer spends 100%

          // Populate Customer Breakdown
          if (type === "Package") {
             if (item.isCustom) customerStats.customPackages += price;
             else customerStats.packages += price;
          }
          else if (type === "Hotel") customerStats.hotels += price;
          else if (type === "Driver") customerStats.drivers += price;
          else if (type === "Guide") customerStats.guides += price;
        }
      }

      // --- ADMIN LOGIC ---
      else if (role === "Admin") {
        isMyBooking = true;
        if (type === "Package") {
          if (item.isCustom) {
            const share = price * 0.70;
            myShare = share;
            adminStats.customPackages += share;
          } else {
            const share = price * 0.40;
            myShare = share;
            adminStats.packages += share;
          }
        } 
        else if (type === "Hotel") {
          const share = price * 0.40;
          myShare = share;
          adminStats.hotels += share;
        }
        else if (type === "Driver" || type === "Guide") {
          const share = price * 0.40;
          myShare = share;
          if(type === "Driver") adminStats.drivers += share;
          else adminStats.guides += share;
        }
      }

      // --- TRAVEL AGENT ---
      else if (role === "TravelAgent") {
        if (type === "Package" && myResourceIds.includes(itemIdStr)) {
          isMyBooking = true;
          myShare = price * 0.30;
        }
      }

      // --- SERVICE PROVIDERS ---
      else if (["HotelManager", "Driver", "Guide"].includes(role)) {
        if ((type === "Hotel" || type === role) && myResourceIds.includes(itemIdStr)) {
          isMyBooking = true;
          myShare = price * 0.60;
        }
        else if (type === "Package" && myPackagesAsResource.includes(itemIdStr)) {
          isMyBooking = true;
          myShare = price * 0.10;
        }
      }

      // --- AGGREGATE ---
      if (isMyBooking) {
        totalEarnings += myShare;
        totalBookings++;
        addToGraph(booking.createdAt, myShare);
      }
    }

    const graphData = Object.keys(monthlyData).map(key => ({
      name: key,
      amount: Math.round(monthlyData[key])
    }));

    // --- DETERMINE BREAKDOWN TO SEND ---
    let finalBreakdown = null;
    if (role === "Admin") finalBreakdown = adminStats;
    if (role === "Customer") finalBreakdown = customerStats; // <--- CRITICAL LINE

    res.status(200).json({
      totalEarnings: Math.round(totalEarnings),
      totalBookings,
      graphData,
      breakdown: finalBreakdown 
    });

  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: error.message });
  }
};