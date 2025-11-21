import api from "./apiService"

export const loginS=async(email:string,password:string)=>{
    return await api.post("/login",{email,password})
}

export const registerS=async(email:string)=>{
    return await api.post("/register",{email})
}

export const sentOtp = async (
  userData: {name:string,email:string,password:string,confirmPassword:string},
  otp: string
) => {
  return await api.post(
    `/verify-otp`,
    {
      ...userData,
      otp,
    }
  );
};

export const resentOtp=async(email:string)=>{
    return await api.post("/resent-otp",{email})
}

export const forgotPasswordS=async(email:string)=>{
    return await api.post("/forgot-password",{email})
}

export const forgotSentOtp=async(email:string,otp:string)=>{
    return await api.post("/verify-forgot-otp",{email,otp})
}

export const resetPasswordS=async(email:string,newPassword:string,confirmPassword:string)=>{
    return await api.post("/reset-password",{email,newPassword,confirmPassword})
}