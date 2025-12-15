const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    // --- BASIC BUS INFO ---
    busNumber: { type: String, required: true, unique: true }, // e.g., "DL-1234"
    operator: { type: String, required: true }, // e.g., "Himalayan Travels" (Changed from operatorName)
    totalSeats: { type: Number, default: 40 },
    type: { type: String, enum: ['AC', 'Non-AC', 'Sleeper'], default: 'AC' },
    
    // --- ROUTE & SCHEDULE INFO (CRITICAL MISSING FIELDS) ---
    source: { type: String, required: true }, // e.g., "Bangalore"
    destination: { type: String, required: true }, // e.g., "Manali"
    date: { type: String, required: true }, // e.g., "2025-12-20"
    departureTime: { type: String, required: true }, // e.g., "20:00"
    arrivalTime: { type: String, required: true }, // e.g., "12:30"
    price: { type: Number, required: true },
    seatsAvailable: { type: Number, required: true },
});

module.exports = mongoose.model('Bus', busSchema);