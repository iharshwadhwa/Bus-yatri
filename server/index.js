require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

// --- IMPORT MODELS ---
const Bus = require('./models/Bus');
const Trip = require('./models/Trip');
const Booking = require('./models/Booking'); // <--- NEW!
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// --- EMAIL CONFIGURATION ---
const sendTicketEmail = async (bookingDetails) => {
  // 1. Create a Test Account (Simulates Gmail)
  let testAccount = await nodemailer.createTestAccount();

  // 2. Create the Transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // 3. Send the Email
  let info = await transporter.sendMail({
    from: '"Bus Yatri 🚌" <tickets@busyatri.com>',
    to: "passenger@example.com", // In a real app, use the user's email
    subject: `Ticket Confirmed: ${bookingDetails.source} to ${bookingDetails.destination}`,
    text: `Your ticket is confirmed! Seats: ${bookingDetails.seats}. Total: ₹${bookingDetails.price}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 500px;">
        <h2 style="color: #2563eb;">Bus Yatri Ticket 🎟️</h2>
        <p>Hello <b>${bookingDetails.name}</b>,</p>
        <p>Your trip is confirmed!</p>
        <hr/>
        <p><b>From:</b> ${bookingDetails.source}</p>
        <p><b>To:</b> ${bookingDetails.destination}</p>
        <p><b>Seats:</b> ${bookingDetails.seats}</p>
        <p><b>Total Paid:</b> ₹${bookingDetails.price}</p>
        <hr/>
        <p style="color: #888;">Safe Travels! 🚌</p>
      </div>
    `
  });

  console.log("📨 Email Sent! Preview URL: " + nodemailer.getTestMessageUrl(info));
  return nodemailer.getTestMessageUrl(info);
};

// --- API ROUTES ---

// A. REGISTER ROUTE
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
  }
});

// B. LOGIN ROUTE
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find User
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Create Token (The "ID Card")
    const token = jwt.sign({ id: user._id }, "SECRET_KEY", { expiresIn: "1h" });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
  }
});

// 1. Get All Trips
app.get('/api/trips', async (req, res) => {
  try {
    const trips = await Trip.find().populate('busId');
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// ... (Your Register, Login, and Get Trips routes are above this) ...

// 2. BOOK SEATS (Secure Version with Validation)
app.post('/api/book', async (req, res) => {
  const { tripId, seatNumbers, passengerName, totalPrice } = req.body;

  try {
    // A. Find the Trip First
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    // B. CRITICAL CHECK: Are any of these seats already booked?
    const isSeatTaken = trip.seats.some(seat => 
      seatNumbers.includes(seat.number) && seat.isBooked
    );

    if (isSeatTaken) {
      return res.status(400).json({ error: "❌ One or more seats are already booked! Please choose different seats." });
    }

    // C. If seats are free, Create the Booking
    const newBooking = new Booking({
      tripId,
      seatNumbers,
      passengerName,
      totalPrice
    });
    await newBooking.save();

    // D. Mark seats as Booked in the Trip
    trip.seats.forEach(seat => {
      if (seatNumbers.includes(seat.number)) {
        seat.isBooked = true;
      }
    });
    await trip.save(); // Save the updated red seats

    // E. SEND EMAIL (NEW!)
    const emailPreviewUrl = await sendTicketEmail({
      name: passengerName,
      source: trip.source,
      destination: trip.destination,
      seats: seatNumbers.join(", "),
      price: totalPrice
    });

    // Send the Preview URL back to frontend so we can click it
    res.json({ 
      message: 'Booking Successful!', 
      booking: newBooking,
      emailUrl: emailPreviewUrl 
    });

  } catch (err) {
    // ... (Error handling remains same) ...

    res.json({ message: 'Booking Successful!', booking: newBooking });

  }
  });

// 3. GET USER BOOKINGS (PASTE IT HERE!)
app.get('/api/my-bookings', async (req, res) => {
  const { name } = req.query; 
  try {
    const bookings = await Booking.find({ passengerName: name }).populate('tripId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});


// 5. CANCEL BOOKING & FREE UP SEATS
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const bookingId = req.params.id;

    // 1. Find the booking first (so we know which seats to free)
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // 2. Find the Trip and make seats "Available" (false) again
    const trip = await Trip.findById(booking.tripId);
    if (trip) {
      trip.seats.forEach(seat => {
        if (booking.seatNumbers.includes(seat.number)) {
          seat.isBooked = false; // <--- FREE THE SEAT
        }
      });
      await trip.save();
    }

    // 3. Delete the Booking
    await Booking.findByIdAndDelete(bookingId);

    res.json({ message: "Booking Cancelled Successfully" });

  } catch (err) {
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});

// Root Route
app.get('/', (req, res) => {
  res.send('Bus Yatri Backend is Running!');
});

// --- START SERVER (This must be last) ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});