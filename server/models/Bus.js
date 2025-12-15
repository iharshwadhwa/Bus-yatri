const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true }, // e.g., "DL-1234"
  operatorName: { type: String, required: true }, // e.g., "Himalayan Travels"
  totalSeats: { type: Number, default: 40 },
  type: { type: String, enum: ['AC', 'Non-AC', 'Sleeper'], default: 'AC' }
});

module.exports = mongoose.model('Bus', busSchema);