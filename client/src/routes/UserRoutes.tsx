import { Route, Routes } from "react-router-dom"
import LoginPage from "../pages/LoginPage"
import ForgotPasswordPage from "../pages/ForgotPassword"
import OTPPage from "../pages/OtpPage"
import ResetPasswordPage from "../pages/ResetPassword"
import  RegisterPage  from "../pages/RegisterPage"
import ForgotOTPPage from "../pages/ForgotOtpPage"
import ImageGallery from "../pages/ImageGallery"

const UserRoutes = () => {
  return (
    <>
    <Routes>
    <Route path="/" element={<LoginPage/>}/>
    <Route path="/register" element={<RegisterPage/>}/>
    <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
    <Route path="/forgot-verify-otp" element={<ForgotOTPPage/>}/>
    <Route path="/verify-otp" element={<OTPPage/>}/>
    <Route path="/reset-password" element={<ResetPasswordPage/>}/>
    <Route path="/dashboard" element={<ImageGallery/>}/>
    </Routes>
    </>
  )
}

export default UserRoutes
