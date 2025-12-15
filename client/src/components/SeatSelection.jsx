import React, { useState } from 'react';

const SeatSelection = ({ trip, onClose }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerName, setPassengerName] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleProceedToPay = () => {
    if (!passengerName) {
      alert("Please enter a passenger name!");
      return;
    }
    setShowPayment(true);
  };

  const handleFinalBooking = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(async () => {
      const bookingData = {
        tripId: trip._id,
        seatNumbers: selectedSeats,
        passengerName: passengerName,
        totalPrice: selectedSeats.length * trip.price
      };

      try {
        const response = await fetch('http://localhost:5000/api/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData)
        });

        if (response.ok) {
          const responseData = await response.json();
          if(responseData.emailUrl) window.open(responseData.emailUrl, '_blank');
          alert(`✅ Booking Confirmed for ${passengerName}!`);
          window.location.reload();
        } else {
          alert("❌ Booking Failed");
          setIsProcessing(false);
        }
      } catch (error) {
        console.error(error);
        alert("Server Error");
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-lg relative animate-fade-in">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-400 hover:text-red-500 font-bold text-xl transition"
        >
          ✕
        </button>

        {!showPayment ? (
          <>
            <div className="text-center mb-4">
              <h2 className="text-2xl font-extrabold text-gray-800">Select Seats</h2>
              <p className="text-gray-500 text-sm">{trip.source} ➝ {trip.destination}</p>
            </div>

            {/* --- LEGEND --- */}
            <div className="flex justify-center gap-4 mb-4 text-xs font-medium text-gray-600">
              <div className="flex items-center gap-1"><div className="w-4 h-4 bg-white border border-gray-300 rounded"></div> Available</div>
              <div className="flex items-center gap-1"><div className="w-4 h-4 bg-green-500 rounded"></div> Selected</div>
              <div className="flex items-center gap-1"><div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div> Booked</div>
            </div>

            {/* --- BUS LAYOUT CONTAINER --- */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 max-h-[400px] overflow-y-auto relative">
              
              {/* Driver Icon */}
              <div className="flex justify-end mb-6 pr-2 opacity-40">
                <span className="text-2xl rotate-90" title="Driver">☸️</span> 
              </div>

              {/* --- THE GRID (5 Columns: 2 Seats + Aisle + 2 Seats) --- */}
              <div className="grid grid-cols-5 gap-y-4 gap-x-2 justify-items-center">
                {trip?.seats?.map((seat, index) => {
                  
                  // Logic to insert "Aisle Space" after every 2nd seat in a row
                  const showAisle = (index + 1) % 2 === 0 && (index + 1) % 4 !== 0;

                  return (
                    <React.Fragment key={seat._id}>
                      {/* 1. THE SEAT BUTTON */}
                      <button
                        disabled={seat.isBooked}
                        onClick={() => handleSeatClick(seat.number)}
                        className={`
                          w-10 h-10 rounded-lg text-xs font-bold transition-all duration-200 shadow-sm border-b-4
                          ${seat.isBooked 
                            ? 'bg-red-50 text-red-300 border-red-200 cursor-not-allowed' 
                            : selectedSeats.includes(seat.number)
                              ? 'bg-green-500 text-white border-green-700 shadow-lg transform scale-110'
                              : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                          }
                        `}
                      >
                        {seat.number.replace('S', '')}
                      </button>

                      {/* 2. THE INVISIBLE AISLE SPACER (Only renders after seat 2, 6, 10...) */}
                      {showAisle && <div className="w-8 h-10"></div>}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* --- BOTTOM BAR --- */}
            <div className="mt-6 border-t pt-4">
              <div className="mb-3">
                <label className="text-xs font-bold text-gray-500 uppercase">Passenger Name</label>
                <input 
                  type="text" 
                  className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  placeholder="e.g. Rahul Sharma"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                />
              </div>

              <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                <div>
                  <p className="text-xs text-blue-500 font-bold uppercase">Total Price</p>
                  <p className="text-2xl font-bold text-blue-700">₹{selectedSeats.length * trip.price}</p>
                </div>
                <button 
                  onClick={handleProceedToPay}
                  disabled={selectedSeats.length === 0}
                  className={`px-6 py-3 rounded-lg font-bold text-white shadow-md transition-transform active:scale-95 ${
                    selectedSeats.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Proceed ›
                </button>
              </div>
            </div>
          </>
        ) : (
          /* --- PAYMENT FORM --- */
          <form onSubmit={handleFinalBooking} className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800">Payment 💳</h2>
            <div className="bg-blue-50 p-4 rounded-xl text-center mb-4">
               <span className="text-blue-800 font-medium">Paying for </span>
               <strong className="text-blue-900">{selectedSeats.length} Seats</strong>
            </div>

            <input type="text" placeholder="Card Number" className="w-full p-3 border rounded-lg bg-gray-50" required />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="MM/YY" className="w-full p-3 border rounded-lg bg-gray-50" required />
              <input type="password" placeholder="CVV" className="w-full p-3 border rounded-lg bg-gray-50" required />
            </div>

            <button 
              type="submit" disabled={isProcessing}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg mt-2 ${
                isProcessing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isProcessing ? 'Processing...' : `Pay ₹${selectedSeats.length * trip.price}`}
            </button>
            <button type="button" onClick={() => setShowPayment(false)} className="w-full text-gray-400 text-sm py-2 hover:text-gray-600">Cancel</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SeatSelection;