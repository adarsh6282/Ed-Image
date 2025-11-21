import { Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerS } from "../services/user.services";
import { successToast } from "../components/Toast";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    confirmPassword: "",
  });
  const navigate=useNavigate()

  const handleRegister = async (e:React.FormEvent) => {
    e.preventDefault()
    try {
        const response=await registerS(formData.email)
        const message=response.data.message
        localStorage.setItem("userData",JSON.stringify(formData))
        successToast(message)
        navigate("/verify-otp")
    } catch (err) {
        console.log(err)
    }
  };
  useEffect(() => {
      const usertoken=localStorage.getItem("token")
      if (usertoken) navigate("/dashboard");
    }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4 relative overflow-hidden">
      <div className="relative bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-md border border-white/20 ">
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
          Create Account
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Start your creative journey
        </p>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
          />

          <input
            type="number"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
          />

          <button
            onClick={handleRegister}
            className="relative p-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Create Account
              <Sparkles
                size={18}
                className="group-hover:rotate-12 transition-transform"
              />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?
          <Link
            className="text-purple-600 hover:text-purple-700 font-semibold ml-2 transition-colors"
            to="/"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
