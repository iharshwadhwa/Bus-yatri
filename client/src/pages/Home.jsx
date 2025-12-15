import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SeatSelection from '../components/SeatSelection';

const Home = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  
  // State to track if search failed
  const [searchError, setSearchError] = useState(false);

  // Search States
  const [search, setSearch] = useState({
    from: '',
    to: '',
    date: ''
  });

  // Load Trips from Backend
  useEffect(() => {
    fetch('http://localhost:5000/api/trips')
      .then(res => res.json())
      .then(data => {
        setTrips(data);
        setFilteredTrips([]); 
      })
      .catch(err => console.error(err));
  }, []);

  const handleSearch = () => {
    // Reset error state before searching
    setSearchError(false);

    let results = trips.filter(trip => {
      const matchFrom = trip.source.toLowerCase().includes(search.from.toLowerCase());
      const matchTo = trip.destination.toLowerCase().includes(search.to.toLowerCase());
      // Handle date only if selected
      const matchDate = search.date ? trip.date === search.date : true;
      return matchFrom && matchTo && matchDate;
    });

    // Sorting Logic
    if (sortBy === 'price_low') {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
      results.sort((a, b) => b.price - a.price);
    }

    setFilteredTrips(results);
    
    // Scroll Logic
    if(results.length > 0) {
      setTimeout(() => {
        const resultsSection = document.getElementById('results-section');
        if(resultsSection) resultsSection.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setSearchError(true);
      setTimeout(() => {
        const errorSection = document.getElementById('no-results-section');
        if(errorSection) errorSection.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Re-run sort when user changes dropdown
  useEffect(() => {
    if (filteredTrips.length > 0) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  // --- NEW: Helper to auto-search when clicking Top Routes ---
  const applyQuickSearch = (from, to) => {
    setSearch({
      from, 
      to, 
      date: '2025-02-10' // Matches the date in your Seed Script!
    });
    // We need a small timeout to allow state to update before filtering
    setTimeout(() => {
        // Trigger the search logic manually since state update is async
        const manualResults = trips.filter(trip => 
            trip.source === from && 
            trip.destination === to && 
            trip.date === '2025-02-10'
        );
        setFilteredTrips(manualResults);
        if(manualResults.length > 0) {
            document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <div className="relative bg-red-500 h-[500px] flex flex-col items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/city-fields.png')]"></div>

        <div className="relative z-10 text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-md">Book Your Journey Now</h1>
          <p className="text-lg opacity-90 drop-shadow-sm">India's Largest Online Bus Ticketing Platform</p>
        </div>

        {/* --- SEARCH WIDGET --- */}
        <div className="relative z-20 bg-white p-6 rounded-xl shadow-2xl flex flex-col md:flex-row items-center gap-4 w-11/12 max-w-4xl text-gray-800">
          
          {/* FROM */}
          <div className="flex-1 w-full border-r border-gray-200 pr-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">From</label>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl">🚌</span>
              <input 
                type="text" 
                placeholder="e.g. Delhi" 
                className="w-full font-semibold outline-none text-lg text-gray-700 placeholder-gray-400"
                value={search.from}
                onChange={(e) => setSearch({...search, from: e.target.value})}
              />
            </div>
          </div>

          {/* TO */}
          <div className="flex-1 w-full border-r border-gray-200 pr-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">To</label>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl">📍</span>
              <input 
                type="text" 
                placeholder="e.g. Manali" 
                className="w-full font-semibold outline-none text-lg text-gray-700 placeholder-gray-400"
                value={search.to}
                onChange={(e) => setSearch({...search, to: e.target.value})}
              />
            </div>
          </div>

          {/* DATE */}
          <div className="flex-1 w-full pr-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Date</label>
            <input 
              type="date" 
              className="w-full mt-1 font-semibold outline-none text-lg text-gray-700"
              value={search.date}
              onChange={(e) => setSearch({...search, date: e.target.value})}
            />
          </div>

          <button 
            onClick={handleSearch}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 w-full md:w-auto uppercase tracking-wider"
          >
            Search
          </button>
        </div>
      </div>

      {/* --- ERROR STATE: NO BUSES FOUND --- */}
      {searchError && (
        <div id="no-results-section" className="max-w-2xl mx-auto mt-12 text-center p-8 bg-white rounded-xl shadow-lg border border-red-100 animate-fade-in">
          <div className="text-6xl mb-4">🚍💨</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! No Buses Found</h2>
          <p className="text-gray-500 mb-6">
            We couldn't find any trips for <span className="font-bold text-red-500">{search.from}</span> to <span className="font-bold text-red-500">{search.to}</span> on this date.
          </p>
          <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm inline-block">
             💡 <strong>Tip:</strong> Try clicking one of the <b>Top Routes</b> below.
          </div>
          <button 
            onClick={() => {
                setSearchError(false);
                setSearch({from: '', to: '', date: ''});
            }}
            className="block mx-auto mt-6 text-red-500 hover:underline font-semibold"
          >
            Clear Search & Try Again
          </button>
        </div>
      )}

      {/* --- STATS SECTION --- */}
      {!filteredTrips.length && !searchError && (
        <div className="max-w-6xl mx-auto py-16 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="text-xl font-bold text-gray-800">36 Million+</h3>
              <p className="text-gray-500 mt-2">Happy customers globally trusted us</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-3">🚌</div>
              <h3 className="text-xl font-bold text-gray-800">5000+</h3>
              <p className="text-gray-500 mt-2">Bus companies worldwide</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-3">🎟️</div>
              <h3 className="text-xl font-bold text-gray-800">200,000+</h3>
              <p className="text-gray-500 mt-2">Tickets booked everyday</p>
            </div>
          </div>
        </div>
      )}

      {/* --- TOP ROUTES SECTION (Updated for Step 3) --- */}
      {!filteredTrips.length && !searchError && (
        <div className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Top Travelled Bus Routes</h2>
            
            {/* Grid updated to 4 columns to show more coverage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              
              {/* NORTH: Delhi -> Manali */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer h-64" 
                   onClick={() => applyQuickSearch('Delhi', 'Manali')}>
                <img src="https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=600&q=80" alt="Manali" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-4 pt-20">
                  <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">North India</p>
                  <h3 className="text-white font-bold text-lg">Delhi ➝ Manali</h3>
                </div>
              </div>

              {/* WEST: Mumbai -> Goa */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer h-64" 
                   onClick={() => applyQuickSearch('Mumbai', 'Goa')}>
                <img src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80" alt="Goa" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-4 pt-20">
                  <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">West India</p>
                  <h3 className="text-white font-bold text-lg">Mumbai ➝ Goa</h3>
                </div>
              </div>

              {/* SOUTH: Bangalore -> Hyderabad */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer h-64" 
                   onClick={() => applyQuickSearch('Bangalore', 'Hyderabad')}>
                <img src="https://plus.unsplash.com/premium_photo-1697730430283-7e4456c78375?w=600&auto=format&fit=crop&q=60" alt="Hyderabad" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-4 pt-20">
                  <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">South India</p>
                  <h3 className="text-white font-bold text-lg">Bangalore ➝ Hyd</h3>
                </div>
              </div>

              {/* EAST: Kolkata -> Digha (New Coverage) */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer h-64" 
                   onClick={() => applyQuickSearch('Kolkata', 'Digha')}>
                <img src="https://images.unsplash.com/photo-1571679654681-ba01b9e1e117?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a29sa2F0YXxlbnwwfHwwfHx8MA%3D%3D" alt="Digha" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-4 pt-20">
                  <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">East India</p>
                  <h3 className="text-white font-bold text-lg">Kolkata ➝ Digha</h3>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- RESULTS SECTION --- */}
      {filteredTrips.length > 0 && (
        <div id="results-section" className="max-w-6xl mx-auto px-4 py-16 animate-fade-in">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {filteredTrips.length} Buses Found
            </h2>
            
            <select 
              className="p-2 border rounded-lg bg-white shadow-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort by: Recommended</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>

          <div className="grid gap-6">
            {filteredTrips.map((trip) => {
              
              const isCheap = trip.price < 1000;
              // Stable "Fast Filling" logic based on price
              const isFastFilling = trip.price % 3 === 0; 

              return (
                <div key={trip._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                  
                  {/* Urgency Ribbon */}
                  {isFastFilling && (
                    <div className="absolute top-0 right-0 bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-bl-lg">
                      🔥 Fast Filling
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row justify-between items-center">
                    
                    {/* LEFT: Bus Info */}
                    <div className="mb-4 md:mb-0 w-full md:w-2/3">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold text-gray-800">{trip.busId?.operatorName || 'Bus Yatri Premium'}</h2>
                        {isCheap && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">Cheapest</span>}
                        <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full font-bold">{trip.busId?.type || 'AC Sleeper'}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                        <span className="font-semibold">{trip.source}</span>
                        <span className="text-gray-300">━━━━━━━━</span>
                        <span className="font-semibold">{trip.destination}</span>
                        <span className="text-gray-400 border-l pl-2 ml-2">{trip.departureTime}</span>
                      </div>

                      <div className="flex gap-4 text-gray-400 text-sm mt-3">
                        <span className="flex items-center gap-1" title="Water Bottle">💧 <span className="hidden sm:inline">Water</span></span>
                        <span className="flex items-center gap-1" title="Charging Point">🔌 <span className="hidden sm:inline">Socket</span></span>
                        <span className="flex items-center gap-1" title="Live Tracking">🛰️ <span className="hidden sm:inline">Track</span></span>
                        {trip.busId?.type?.includes('AC') && (
                          <span className="flex items-center gap-1" title="Air Conditioning">❄️ <span className="hidden sm:inline">AC</span></span>
                        )}
                      </div>
                    </div>

                    {/* RIGHT: Price & Button */}
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className="text-gray-400 text-xs">Starting from</p>
                      <p className="text-3xl font-bold text-gray-800">₹{trip.price}</p>
                      <button 
                        onClick={() => setSelectedTrip(trip)} 
                        className="mt-2 bg-red-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-600 transition shadow-md active:scale-95"
                      >
                        VIEW SEATS
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedTrip && (
        <SeatSelection 
          trip={selectedTrip} 
          onClose={() => setSelectedTrip(null)} 
        />
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-gray-800 text-gray-300 py-10 text-center">
        <p className="text-lg font-bold text-white mb-2">Bus Yatri 🚌</p>
        <p className="text-sm">The World's Largest Bus Booking Platform.</p>
        <p className="text-xs mt-4 opacity-50">© 2025 All rights reserved.</p>
      </footer>

    </div>
  );
};

export default Home;