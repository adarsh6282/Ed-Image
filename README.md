📸 Ed-Image

A simple full-stack MERN application that allows users to upload, manage, and store images securely in the cloud.

🚀 Features

🔐 User Authentication – Secure login & registration using JWT.

☁️ Cloud Image Upload – Images are stored on Cloudinary for fast delivery.

🗂️ Image Management – Users can upload, view, and delete their images.

🧱 Repository Pattern – Clean backend structure for better scalability and maintainability.

🎨 Responsive UI – Simple and user-friendly React interface.

🛠️ Tech Stack

Frontend: React, TypeScript, Tailwind CSS
Backend: Node.js, Express.js, TypeScript
Database: MongoDB, Mongoose
Storage: Cloudinary
Auth: JWT

🏗️ Architecture Overview
The backend follows a Repository Pattern, organizing code into:

Controllers – Handle requests and responses.
Services – Contain business logic.
Repositories – Interact with the database.
This keeps the codebase clean, modular, and easy to maintain.


📦 How to Run Locally
1️⃣ Clone the project
```bash
git clone https://github.com/adarsh6282/ed-image.git
cd ed-image
```

2️⃣ Backend Setup
```bash
cd server
npm install
npm run dev
```


Add your .env file:
```bash
MONGO_URI=your_mongo_url
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
3️⃣ Frontend Setup
```bash
cd client
npm install
npm run dev
```
