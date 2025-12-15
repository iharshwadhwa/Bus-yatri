import { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  
  // 1. We get the user here to show their name
  const user = JSON.parse(localStorage.getItem('user'));

  // 2. We use 'storedUser' inside here to avoid conflicting dependencies
  const fetchBookings = useCallback(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      fetch(`http://localhost:5000/api/my-bookings?name=${storedUser.name}`)
        .then(res => res.json())
        .then(data => setBookings(data))
        .catch(err => console.error(err));
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this ticket?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert("✅ Ticket Cancelled!");
        fetchBookings(); 
      } else {
        alert("❌ Failed to cancel");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">🎟️ My Tickets</h1>
          {/* 3. USING THE VARIABLE HERE FIXES THE ERROR! */}
          <span className="text-gray-500 font-medium">
            User: {user?.name || 'Guest'}
          </span>
        </div>

        <div className="grid gap-4">
          {!bookings || bookings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xl text-gray-500">No bookings found.</p>
              <p className="text-sm text-gray-400 mt-2">Go to Dashboard to book a trip!</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking._id} className="bg-white p-6 rounded-xl shadow-md border-l-8 border-green-500 flex justify-between items-center hover:shadow-lg transition">
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {booking.tripId?.source} ➝ {booking.tripId?.destination}
                  </h2>
                  <p className="text-gray-500 font-medium mt-1">
                    📅 Date: {booking.tripId ? new Date(booking.tripId.date).toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="text-gray-600 mt-2">
                    💺 Seats: <span className="font-bold bg-green-100 text-green-800 px-2 py-1 rounded">{booking.seatNumbers.join(", ")}</span>
                  </p>
                </div>

                <div className="text-right flex flex-col items-end">
                  <p className="text-3xl font-bold text-green-600 mb-2">₹{booking.totalPrice}</p>
                  
                  <button 
                    onClick={() => handleCancel(booking._id)}
                    className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white transition"
                  >
                    Cancel Ticket ✕
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;