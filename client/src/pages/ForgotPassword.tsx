import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordS } from "../services/user.services";
import { errorToast, successToast } from "../components/Toast";
import type { AxiosError } from "axios";
import { emailSchema } from "../utils/validator";
import { PropagateLoader } from "react-spinners";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = emailSchema.safeParse({email});

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      errorToast(errors.email?.[0] || "Invalid input");
      return;
    }
    setLoading(true)
    try {
      const response = await forgotPasswordS(email);
      localStorage.setItem("email", JSON.stringify(email));
      const message = response.data.message;
      successToast(message);
      navigate("/forgot-verify-otp");
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
          to={"/"}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back to Login</span>
        </Link>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 mt-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            Forgot Password?
          </h2>
          <p className="text-gray-600 text-sm">
            No worries! Enter your email and we'll send you a reset code
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="relative p-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group disabled:opacity-70"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 pb-2.5">
              {loading ? (
                <PropagateLoader size={12} color="#ffffff" />
              ) : (
                  "Send Reset Code"
              )}
            </span>

            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
