const mongoose = require('mongoose');
const Bus = require('./models/Bus');
const Trip = require('./models/Trip');
// If you use Booking model, keep this, otherwise optional
// const Booking = require('./models/Booking'); 
require('dotenv').config();

// --- CONFIGURATION ---
// Fallback URI if .env is missing
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bus-booking-db';

// --- 1. SEAT GENERATOR ---
const generateSeats = () => {
  let seats = [];
  for (let i = 1; i <= 40; i++) {
    seats.push({
      number: `S${i}`,
      isBooked: false
    });
  }
  return seats;
};

// --- 2. DATA LISTS ---
// fancyModels are just for display in the operator name now
const acModels = ['Volvo Multi-Axle', 'Scania Sleeper', 'Mercedes Benz', 'Bharat Benz'];
const nonAcModels = ['Ashok Leyland', 'Tata Pushback', 'Eicher Starline'];

const cities = [
  // North
  { from: 'Delhi', to: 'Manali', operator: 'Laxmi Holidays' },
  { from: 'Delhi', to: 'Shimla', operator: 'Zingbus' },
  { from: 'Delhi', to: 'Jaipur', operator: 'Orbit Aviation' },
  { from: 'Chandigarh', to: 'Delhi', operator: 'NueGo Electric' },
  { from: 'Lucknow', to: 'Varanasi', operator: 'UPSRTC' },
  { from: 'Dehradun', to: 'Delhi', operator: 'City Land Travels' },
  
  // West
  { from: 'Mumbai', to: 'Goa', operator: 'VRL Logistics' },
  { from: 'Mumbai', to: 'Pune', operator: 'Purple Metrolink' },
  { from: 'Ahmedabad', to: 'Surat', operator: 'Srinath Travel Agency' },
  { from: 'Pune', to: 'Nagpur', operator: 'Prasanna Purple' },
  { from: 'Surat', to: 'Mumbai', operator: 'Paulo Travels' },
  
  // South
  { from: 'Bangalore', to: 'Hyderabad', operator: 'Orange Travels' },
  { from: 'Bangalore', to: 'Chennai', operator: 'Jabbar Travels' },
  { from: 'Chennai', to: 'Coimbatore', operator: 'KPN Travels' },
  { from: 'Hyderabad', to: 'Vijayawada', operator: 'Morning Star' },
  { from: 'Kochi', to: 'Trivandrum', operator: 'Greenline Kerala' },
  { from: 'Tirupati', to: 'Bangalore', operator: 'SRS Travels' },
  
  // East & Central
  { from: 'Kolkata', to: 'Digha', operator: 'SBSTC' },
  { from: 'Kolkata', to: 'Siliguri', operator: 'Greenline' },
  { from: 'Bhubaneswar', to: 'Puri', operator: 'OSRTC' },
  { from: 'Guwahati', to: 'Shillong', operator: 'Network Travels' },
  { from: 'Indore', to: 'Bhopal', operator: 'Hans Travels' },
  { from: 'Raipur', to: 'Nagpur', operator: 'Mahendra Travels' }
];

// --- 3. SEED FUNCTION ---
const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️ Clearing old data...');
    try {
      await Bus.deleteMany({});
      await Trip.deleteMany({});
    } catch(e) { 
      console.log('⚠️ Collections might be empty, creating new ones...'); 
    }

    console.log('🚌 Generating 45 Trips with 40 seats each...');
    
    // Loop to create 45 Buses
    for (let i = 0; i < 45; i++) {
      const route = cities[i % cities.length];
      
      // LOGIC: 60% AC, 40% Non-AC
      const isAcBus = i % 10 < 6; 
      
      // STRICT FIX: Database only accepts 'AC' or 'Non-AC'
      const type = isAcBus ? 'AC' : 'Non-AC';
      
      // visual flair: Add the fancy model name to the Operator Name instead!
      const modelName = isAcBus 
        ? acModels[Math.floor(Math.random() * acModels.length)]
        : nonAcModels[Math.floor(Math.random() * nonAcModels.length)];

      const finalOperatorName = `${route.operator} (${modelName})`;

      // 1. Create Bus
      const newBus = new Bus({
        operatorName: finalOperatorName,
        type: type, // <--- NOW SAFE ('AC' or 'Non-AC')
        busNumber: `KA-${Math.floor(10 + Math.random() * 89)}-${String.fromCharCode(65+Math.random()*25)}${String.fromCharCode(65+Math.random()*25)}-${Math.floor(1000 + Math.random() * 8999)}`,
        capacity: 40
      });
      const savedBus = await newBus.save();

      // 2. Price Logic
      const price = isAcBus 
        ? Math.floor(800 + Math.random() * 1700) 
        : Math.floor(300 + Math.random() * 600);

      // 3. Create Trip (Linked to Bus)
      const newTrip = new Trip({
        busId: savedBus._id,
        source: route.from,
        destination: route.to,
        departureTime: `${Math.floor(Math.random() * 23)}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`,
        arrivalTime: "06:00", 
        date: "2025-02-10", // <--- SEARCH FOR THIS DATE
        price: price,
        rating: (3.5 + Math.random() * 1.5).toFixed(1),
        seats: generateSeats()
      });
      
      await newTrip.save();
    }

    console.log(`✅ Success! Added 45 Trips.`);
    process.exit();

  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

seedDatabase();