import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { resentOtp, sentOtp } from "../services/user.services";
import { successToast } from "../components/Toast";

export default function OTPPage() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer === 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
      const usertoken=localStorage.getItem("token")
      if (usertoken) navigate("/dashboard");
    }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const stored = localStorage.getItem("userData");
    const userData = stored ? JSON.parse(stored) : null;
    try {
      const response = await sentOtp(userData, otp);
      const token = response.data.token;
      localStorage.setItem("token", token);
      localStorage.removeItem("userData");
      const message=response.data.message
      successToast(message)
      navigate("/dashboard");
    } catch (err: unknown) {
      console.log(err);
    }
  };

  const handleResend = async () => {
    setTimer(60);
    try {
      const stored = localStorage.getItem("userData");
      const userData = stored ? JSON.parse(stored) : null;
      const response = await resentOtp(userData.email);
      const message=response.data.message
      successToast(message)
    } catch (err: unknown) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4 relative overflow-hidden">
      <div className="relative bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-md border border-white/20">
        <Link
          to={"/register"}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </Link>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            Enter Verification Code
          </h2>
          <p className="text-gray-600 text-sm">
            We sent a code to you email
            <br />
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white text-center text-2xl font-bold tracking-widest"
              maxLength={6}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="relative w-full cursor-pointer p-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Verify Code
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <span className="text-gray-400 text-sm font-medium">OR</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>

        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">Didn't receive the code?</p>

          {timer > 0 ? (
            <p className="text-purple-600 font-semibold">
              Resend Code in {timer}s
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-purple-600 cursor-pointer hover:text-purple-700 font-semibold transition-colors"
            >
              Resend Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
