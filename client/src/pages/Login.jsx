import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      // Save the Token and User Info
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect based on role
      const role = res.data.user.role;
      if (role === "Admin") navigate("/admin/overview");
      else if (role === "HotelManager") navigate("/manager/overview");
      else if (role === "TravelAgent") navigate("/agent/overview");
      else if (role === "Driver") navigate("/driver/overview");
      else if (role === "Guide") navigate("/guide/overview");
      else navigate("/"); // Customers go to Homepage

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      
      {/* BACK BUTTON */}
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition">
        <FaArrowLeft /> Back to Home
      </Link>

      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#0F172A]">Planora.</h1>
          <p className="text-gray-500 mt-2">Welcome back! Please login.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              required
              autoComplete="username"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="user@planora.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0F172A] text-white py-3 rounded-lg hover:bg-slate-800 transition font-semibold"
          >
            Login
          </button>
        </form>
        
        <div className="mt-4 text-center">
           <p className="text-sm text-gray-600">New to Planora? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;