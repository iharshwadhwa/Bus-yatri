# 🚌 Bus Yatri - Online Bus Booking System

**Bus Yatri** is a modern, full-stack bus ticket booking platform built using the **MERN Stack** (MongoDB, Express, React, Node.js). It allows users to search for buses, filter by price/amenities, and select specific seats using an interactive UI.

## 🚀 Key Features

* **🔍 Search & Filter:** Search buses by Source, Destination, and Date.
* **💺 Interactive Seat Selection:** Visual seat map to pick available seats.
* **⚡ Dynamic Badges:** "Fast Filling" and "Cheapest" tags based on real-time data.
* **📱 Responsive Design:** Fully responsive UI built with Tailwind CSS.
* **🛠️ RESTful API:** Custom backend API for handling trips, buses, and bookings.
* **Sorting:** Sort buses by Price (Low/High) or Ratings.

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS
* Lucide React (Icons)

**Backend:**
* Node.js & Express.js
* MongoDB (Mongoose)
* Cors & Dotenv

---

## ⚙️ Getting Started

Follow these steps to run the project locally on your machine.

### 1. Clone the Repository
git clone [https://github.com/YOUR_USERNAME/bus-yatri.git](https://github.com/YOUR_USERNAME/bus-yatri.git)
cd bus-yatri

###2. Backend Setup
Navigate to the server folder and install dependencies:
cd server
npm install

Create a .env file in the server folder:
PORT=5000
MONGO_URI=mongodb://localhost:27017/bus-booking-db

Seed the Database (Add Dummy Data):
node seed.js
You should see: "✅ Success! Added 45 Trips."

Start the Server:
npm start
Server runs on http://localhost:5000

Frontend Setup
Open a new terminal, navigate to the client folder, and install dependencies:
cd client
npm install

Start the React App:
npm run dev
App runs on http://localhost:5173

🤝 Contributing
Contributions, issues, and feature requests are welcome!

📝 License
This project is open source.
### **Why this is good:**
1.  **Professional:** It uses emojis and clear sections.
2.  **Instructional:** It tells people exactly how to run your `seed.js` script (which is a cool feature to show off).
3.  **Visual:** It has a spot for screenshots, which you can add later by uploading images to your repo.
