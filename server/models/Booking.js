const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  seatNumbers: [String], // e.g., ["S1", "S2"]
  passengerName: String,
  totalPrice: Number,
  bookingDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);