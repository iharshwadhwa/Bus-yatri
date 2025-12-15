import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SeatSelection from '../components/SeatSelection';

function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  
  // --- NEW: Search States ---
  const [search, setSearch] = useState({
    from: '',
    to: '',
    date: ''
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/trips')
      .then(res => res.json())
      .then(data => setTrips(data))
      .catch(err => console.error("Error fetching trips:", err))
  }, []);

  // --- NEW: Filter Logic ---
  const filteredTrips = trips.filter(trip => {
    const matchFrom = trip.source.toLowerCase().includes(search.from.toLowerCase());
    const matchTo = trip.destination.toLowerCase().includes(search.to.toLowerCase());
    // Only check date if user selected one
    const matchDate = search.date ? trip.date.startsWith(search.date) : true;
    
    return matchFrom && matchTo && matchDate;
  });

  return (
    <div className="min-h-screen bg-gray-100"> 
      <Navbar /> 

      <div className="p-8">
        
        {/* --- NEW: SEARCH BAR SECTION --- */}
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">From</label>
              <input 
                type="text" 
                placeholder="e.g. Delhi"
                className="w-full p-2 border rounded-lg bg-gray-50"
                value={search.from}
                onChange={(e) => setSearch({...search, from: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">To</label>
              <input 
                type="text" 
                placeholder="e.g. Manali"
                className="w-full p-2 border rounded-lg bg-gray-50"
                value={search.to}
                onChange={(e) => setSearch({...search, to: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
              <input 
                type="date" 
                className="w-full p-2 border rounded-lg bg-gray-50"
                value={search.date}
                onChange={(e) => setSearch({...search, date: e.target.value})}
              />
            </div>
            <button 
              onClick={() => setSearch({ from: '', to: '', date: '' })}
              className="bg-gray-800 text-white p-2 rounded-lg font-bold hover:bg-gray-900 transition"
            >
              Reset Filters ↺
            </button>
          </div>
        </div>

        {/* --- TRIP LIST --- */}
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          {filteredTrips.length} Bus Trips Found 🚌
        </h1>

        <div className="max-w-4xl mx-auto grid gap-6">
          {filteredTrips.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p className="text-xl">No buses found for this route.</p>
              <p className="text-sm">Try changing your search or clicking Reset.</p>
            </div>
          ) : (
            filteredTrips.map((trip) => (
              <div key={trip._id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 flex justify-between items-center hover:shadow-lg transition">
                
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {trip.source} ➝ {trip.destination}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {trip.busId?.operatorName || 'Bus Yatri'} • {trip.busId?.type || 'AC Seater'}
                  </p>
                  <span className="inline-block mt-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    {new Date(trip.date).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">₹{trip.price}</p>
                  <button 
                    onClick={() => setSelectedTrip(trip)} 
                    className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105"
                  >
                    View Seats
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {selectedTrip && (
        <SeatSelection 
          trip={selectedTrip} 
          onClose={() => setSelectedTrip(null)} 
        />
      )}

    </div> 
  )
}

export default Dashboard;