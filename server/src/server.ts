import express from "express"
import dotenv from "dotenv"
import Database from "./config/db.config"
import userRoutes from "./routes/user.routes"
import imageRoutes from "./routes/image.routes"
import morgan from "morgan"
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config()

const app=express()

Database()

const PORT=process.env.PORT

const allowedOrigins=[
    "http://localhost:5173",
    "https://ed-image-client.onrender.com"
]

app.use(cors({
    origin:allowedOrigins,
    credentials:true
}))

app.use(express.json())
app.use(morgan("dev"))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use("/api",userRoutes)
app.use("/api/images",imageRoutes)

app.listen(PORT,()=>{
    console.log("server started")
})