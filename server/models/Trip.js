const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  busId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bus', 
    required: true 
  },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  
  // --- THIS SECTION IS CRITICAL ---
  seats: [
    {
      number: { type: String },  // e.g., "S1"
      isBooked: { type: Boolean, default: false }
    }
  ]
  // --------------------------------
});

module.exports = mongoose.model('Trip', tripSchema);