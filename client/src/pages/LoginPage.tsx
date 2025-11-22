import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginS } from "../services/user.services";
import { errorToast, successToast } from "../components/Toast";
import type { AxiosError } from "axios";
import { signinSchema } from "../utils/validator";
import { PropagateLoader } from "react-spinners";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = signinSchema.safeParse({ email, password });

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      errorToast(errors.email?.[0] || errors.password?.[0] || "Invalid input");
      return;
    }
    setLoading(true);
    try {
      const response = await loginS(email, password);
      const token = response.data.token;
      const message = response.data.message;
      localStorage.setItem("token", token);
      successToast(message);
      navigate("/dashboard");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      console.log(err);
      errorToast(error.response?.data?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const usertoken = localStorage.getItem("token");
    if (usertoken) navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4 relative overflow-hidden">
      <div className="relative bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-md border border-white/20 ">
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Sign in to continue editing
        </p>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
          />

          <div className="flex justify-end">
            <Link
              className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
              to="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="relative p-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group disabled:opacity-70"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 pb-2.5">
              {loading ? (
                <PropagateLoader size={12} color="#ffffff" />
              ) : (
                <>
                  Sign In
                  <Sparkles
                    size={18}
                    className="group-hover:rotate-12 transition-transform"
                  />
                </>
              )}
            </span>

            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?
          <Link
            className="text-purple-600 hover:text-purple-700 font-semibold ml-2 transition-colors"
            to="/register"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
