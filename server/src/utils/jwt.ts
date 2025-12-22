import jwt from "jsonwebtoken"

export const generateToken = (id:string,email: string): string => {
  const payload={_id:id,email:email}
  return jwt.sign(
    payload,
    process.env.JWT_SECRET!,
    { expiresIn: "3m" }
  );
}
export const generateRefreshToken = (id:string,email: string): string => {
  const payload={_id:id,email:email}
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );
}