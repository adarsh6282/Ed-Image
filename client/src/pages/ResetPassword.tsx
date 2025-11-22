import React, { useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { resetPasswordS } from "../services/user.services";
import { errorToast, successToast } from "../components/Toast";
import type { AxiosError } from "axios";
import { resetPasswordSchema } from "../utils/validator";
import { PropagateLoader } from "react-spinners";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = resetPasswordSchema.safeParse({
      newPassword,
      confirmPassword,
    });

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      errorToast(
        errors.newPassword?.[0] ||
          errors.confirmPassword?.[0] ||
          "Invalid input"
      );
      return;
    }
    setLoading(true)
    try {
      const stored = localStorage.getItem("email");
      const email = stored ? JSON.parse(stored) : null;
      const response = await resetPasswordS(
        email,
        newPassword,
        confirmPassword
      );
      const message = response.data.message;
      localStorage.removeItem("email");
      successToast(message);
      navigate("/");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      console.log(err);
      errorToast(error.response?.data?.message ?? "Something went wrong");
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    const usertoken = localStorage.getItem("token");
    if (usertoken) navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4 relative overflow-hidden">
      <div className="relative bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-md border border-white/20">
        <Link
          to={"/forgot-verify-otp"}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </Link>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            Create New Password
          </h2>
          <p className="text-gray-600 text-sm">
            Your new password must be different from previous passwords
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-4 pr-12 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-4 pr-12 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="relative p-4 h-[56px] bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group disabled:opacity-70"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 pb-2.5">
              {loading ? (
                <PropagateLoader size={12} color="#ffffff" />
              ) : (
                <>
                  Reset Password
                </>
              )}
            </span>

            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
