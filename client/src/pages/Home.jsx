import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import Navbar from "../components/Navbar";
import { FaSearch, FaMapMarkerAlt, FaMoneyBillWave, FaStar, FaCar, FaHotel, FaBoxOpen } from "react-icons/fa";
import BookingModal from "../components/BookingModal";

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("packages");
  const [data, setData] = useState({ packages: [], hotels: [], drivers: [], guides: [] });
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const user = JSON.parse(sessionStorage.getItem("user"));
  
  const [searchLocation, setSearchLocation] = useState("");
  const [searchPrice, setSearchPrice] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/public/home-data");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/public/search", {
        params: {
          type: activeTab,
          location: searchLocation,
          price: searchPrice
        }
      });
      setData(prev => ({
        ...prev,
        [activeTab]: res.data
      }));
      document.getElementById(activeTab)?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (item, type) => {
    setSelectedItem({ item, type });
  };

  return (
    <div className="min-h-screen font-sans bg-slate-50">
      <Navbar />

      {selectedItem && (
        <BookingModal
          item={selectedItem.item}
          type={selectedItem.type}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* ================= HERO SECTION ================= */}
      <div className="relative h-[85vh] w-full bg-slate-900 flex items-center justify-center px-4">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589802829985-817e51171b92?q=80&w=2070&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-50"></div>

        <div className="relative z-10 text-center w-full max-w-4xl mt-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Discover Pakistan's <br /> <span className="text-blue-400">Hidden Gems</span>
          </h1>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            Plan your entire journey in one place. Book tours, luxury hotels, and reliable drivers seamlessly with Planora.
          </p>

          {/* SEARCH CARD */}
          <div className="bg-white p-2 rounded-3xl shadow-2xl max-w-3xl mx-auto backdrop-blur-sm bg-white/90">
            <div className="flex gap-2 mb-2 p-1">
              {["packages", "hotels", "drivers", "guides"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 capitalize
                    ${activeTab === tab ? "bg-slate-900 text-white shadow-lg" : "bg-transparent text-slate-500 hover:bg-gray-100"}`}
                >
                  {tab === "packages" && <FaBoxOpen />}
                  {tab === "hotels" && <FaHotel />}
                  {tab === "drivers" && <FaCar />}
                  {tab === "guides" && <FaMapMarkerAlt />}
                  {tab}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center border border-gray-100">
              <div className="flex-1 w-full border-r border-gray-100 pr-4">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Location</label>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-500" />
                  <input 
                    type="text" 
                    placeholder={
                      activeTab === 'drivers' ? "Pickup City" : 
                      activeTab === 'guides' ? "City or Language" :
                      "Destination"
                    }
                    className="w-full text-sm font-semibold text-slate-700 outline-none" 
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 w-full pr-4">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">
                   {activeTab === 'drivers' ? "Max Rate (PKR/km)" : 
                    activeTab === 'guides' ? "Max Rate (PKR/day)" : 
                    "Max Budget (PKR)"}
                </label>
                <div className="flex items-center gap-2">
                  <FaMoneyBillWave className="text-green-500" />
                  <input 
                    type="number" 
                    placeholder={activeTab === 'drivers' ? "e.g. 50" : activeTab === 'guides' ? "e.g. 3000" : "e.g. 50000"} 
                    className="w-full text-sm font-semibold text-slate-700 outline-none" 
                    value={searchPrice}
                    onChange={(e) => setSearchPrice(e.target.value)}
                  />
                </div>
              </div>
              <button 
                onClick={handleSearch}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl shadow-lg transition-all transform hover:scale-105"
              >
                <FaSearch size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ABOUT SECTION (RESTORED) ================= */}
      <section id="about" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="text-blue-600 font-bold text-sm uppercase tracking-wider">About Planora</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-6">Simplifying Travel Management</h2>
            <p className="text-slate-600 leading-relaxed text-lg mb-6">
              Planora is Pakistan's first all-in-one travel ecosystem. Whether you are looking for a pre-planned adventure, a comfortable stay, or a reliable ride, we connect you with verified service providers instantly.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-600 pl-4">
                <h4 className="font-bold text-2xl text-slate-900">500+</h4>
                <p className="text-slate-500 text-sm">Destinations</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-bold text-2xl text-slate-900">10k+</h4>
                <p className="text-slate-500 text-sm">Happy Travelers</p>
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute -inset-4 bg-blue-100 rounded-full blur-3xl opacity-50 z-0"></div>
            <img
              src="https://images.unsplash.com/photo-1627896157732-ca03810486c8?q=80&w=1170&auto=format&fit=crop"
              alt="Pakistan Travel"
              className="relative z-10 rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition duration-500"
            />
          </div>
        </div>
      </section>

      {/* ================= PACKAGES SECTION ================= */}
      <section id="packages" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Trending Packages" subtitle="Curated tours for your next adventure" />

          {/* CUSTOM PACKAGE BUTTON (Only for Customers) */}
          {user && user.role === "Customer" && (
            <div className="text-center mt-6">
              <p className="text-gray-500 mb-3 text-sm">Want something unique?</p>
              <button 
                onClick={() => navigate("/customer/create-custom")} 
                className="bg-slate-800 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-900 transition shadow-lg flex items-center gap-2 mx-auto"
              >
                <FaBoxOpen /> Build Your Own Package
              </button>
            </div>
          )}

          {loading ? <p className="text-center mt-10">Loading packages...</p> : (
            <div className="flex overflow-x-auto gap-6 mt-10 pb-8 no-scrollbar snap-x snap-mandatory px-4">
              {data.packages.length > 0 ? data.packages.map((pkg) => (
                <div key={pkg._id} className="min-w-[320px] shrink-0 snap-start">
                  <PackageCard 
                    image={pkg.images[0] || "https://via.placeholder.com/300"}
                    title={pkg.title}
                    price={pkg.price.toLocaleString()}
                    rating="4.8"
                    location={pkg.destination}
                    duration={pkg.duration}
                    onBook={() => handleBook(pkg, "Package")}
                  />
                </div>
              )) : <p className="text-center w-full text-gray-400">No packages available.</p>}
            </div>
          )}
        </div>
      </section>

      {/* ================= HOTELS SECTION ================= */}
      <section id="hotels" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Luxury Stays" subtitle="Top rated hotels by our customers" />

          <div className="flex overflow-x-auto gap-6 mt-10 pb-8 no-scrollbar snap-x snap-mandatory px-4">
            {data.hotels.length > 0 ? data.hotels.map((hotel) => (
              <div key={hotel._id} className="min-w-[280px] shrink-0 snap-start">
                <HotelCard 
                  image={hotel.images?.img1 || "https://via.placeholder.com/300"}
                  name={hotel.name}
                  city={hotel.city}
                  price={hotel.pricePerNight.toLocaleString()}
                  onBook={() => handleBook(hotel, "Hotel")}
                />
              </div>
            )) : <p className="text-center w-full text-gray-400">No hotels registered yet.</p>}
          </div>
        </div>
      </section>

      {/* ================= DRIVERS SECTION ================= */}
      <section id="drivers" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Reliable Drivers" subtitle="Comfortable rides for city to city travel" />

          <div className="flex overflow-x-auto gap-6 mt-10 pb-8 no-scrollbar snap-x snap-mandatory px-4">
            {data.drivers.length > 0 ? data.drivers.map((driver) => (
              <div key={driver._id} className="min-w-[300px] shrink-0 snap-start">
                <DriverCard 
                  name={driver.fullName}
                  car={`${driver.carName} (${driver.carModel})`}
                  city="Pakistan"
                  rate={driver.pricePerKm}
                  image={driver.profilePicture}
                  onBook={() => handleBook(driver, "Driver")}
                />
              </div>
            )) : <p className="text-center w-full text-gray-400">No drivers available yet.</p>}
          </div>
        </div>
      </section>

      {/* ================= GUIDES SECTION ================= */}
      <section id="guides" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Expert Tour Guides" subtitle="Locals who know every corner of the destination" />
          
          <div className="flex overflow-x-auto gap-6 mt-10 pb-8 no-scrollbar snap-x snap-mandatory px-4">
             {data.guides?.length > 0 ? data.guides.map((guide) => (
               <div key={guide._id} className="min-w-[300px] shrink-0 snap-start">
                 <GuideCard 
                   name={guide.fullName}
                   language={guide.language}
                   city={guide.address} 
                   rate={guide.pricePerDay || 3000} 
                   image={guide.profilePicture}
                   onBook={() => handleBook(guide, "Guide")}
                 />
               </div>
             )) : <p className="text-center w-full text-gray-400">No guides available yet.</p>}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12 text-center">
        <p>© 2025 Planora Travel Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

// --- Sub Components ---

const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center">
    <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
    <p className="text-gray-500 mt-2">{subtitle}</p>
    <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
  </div>
);

const PackageCard = ({ image, title, price, location, rating, duration, onBook }) => (
  <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
    <div className="h-56 overflow-hidden relative">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white">
        {duration} Days
      </div>
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 text-orange-500">
        <FaStar /> {rating}
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{title}</h3>
      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2 mb-4">
        <FaMapMarkerAlt className="text-blue-500" /> {location}
      </div>
      <div className="flex justify-between items-center border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs text-gray-400 font-bold uppercase">Starting From</p>
          <p className="text-lg font-bold text-blue-600">PKR {price}</p>
        </div>
        <button onClick={onBook} className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition">Book Now</button>
      </div>
    </div>
  </div>
);

const HotelCard = ({ image, name, city, price, onBook }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition h-full">
    <div className="h-40 overflow-hidden">
      <img src={image} alt={name} className="w-full h-full object-cover" />
    </div>
    <div className="p-4">
      <h4 className="font-bold text-slate-800 line-clamp-1">{name}</h4>
      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><FaMapMarkerAlt /> {city}</p>
      <div className="mt-3 flex justify-between items-end">
        <div>
          <p className="text-sm font-bold text-purple-600">PKR {price}</p>
          <p className="text-[10px] text-gray-400">per night</p>
        </div>
        <button onClick={onBook} className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded font-bold hover:bg-purple-700">Book</button>
      </div>
    </div>
  </div>
);

const DriverCard = ({ name, car, city, rate, image, onBook }) => (
  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-gray-200 hover:border-orange-200 hover:bg-orange-50 transition cursor-pointer group h-full">
    <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden border border-gray-200 shrink-0">
      <img src={image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} alt="Driver" className="w-full h-full object-cover" />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-bold text-slate-800 truncate">{name}</h4>
      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate"><FaCar /> {car}</p>
    </div>
    <div className="text-right flex flex-col items-end shrink-0">
      <p className="text-sm font-bold text-orange-600">PKR {rate}<span className="text-gray-400 font-normal text-[10px]">/km</span></p>
      <button onClick={onBook} className="mt-1 text-[10px] bg-orange-600 text-white px-2 py-1 rounded font-bold opacity-0 group-hover:opacity-100 transition">Book</button>
    </div>
  </div>
);

const GuideCard = ({ name, language, city, rate, image, onBook }) => (
  <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 hover:border-teal-200 hover:bg-teal-50 transition cursor-pointer h-full">
    <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden shrink-0"><img src={image || "https://cdn-icons-png.flaticon.com/512/1995/1995574.png"} alt="Guide" className="w-full h-full object-cover" /></div>
    <div className="flex-1 min-w-0">
      <h4 className="font-bold text-slate-800 truncate">{name}</h4>
      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate"><FaMapMarkerAlt /> {city}</p>
      <div className="flex gap-1 mt-1 flex-wrap">
        {language.split(',').map((lang, i) => <span key={i} className="text-[10px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded">{lang.trim()}</span>)}
      </div>
    </div>
    <div className="text-right flex flex-col items-end shrink-0">
      <p className="text-sm font-bold text-teal-600">PKR {rate}</p>
      <p className="text-[10px] text-gray-400">per day</p>
      <button onClick={onBook} className="mt-1 text-[10px] bg-teal-600 text-white px-2 py-1 rounded font-bold opacity-0 group-hover:opacity-100 transition">Book</button>
    </div>
  </div>
);

export default Home;