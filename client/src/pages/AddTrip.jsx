import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const AddTrip = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    price: '',
    date: '',
    busName: '',
    busType: 'AC'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/add-trip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      alert("✅ New Trip Added Successfully!");
      navigate('/dashboard'); // Go back to home to see the new bus
    } else {
      alert("❌ Error adding trip");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add New Trip 🚌</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From</label>
            <input name="from" onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="e.g. Mumbai" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">To</label>
            <input name="to" onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="e.g. Pune" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
              <input name="price" type="number" onChange={handleChange} className="w-full p-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input name="date" type="date" onChange={handleChange} className="w-full p-2 border rounded-lg" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bus Name</label>
            <input name="busName" onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="e.g. Volvo Fast" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bus Type</label>
            <select name="busType" onChange={handleChange} className="w-full p-2 border rounded-lg">
              <option value="AC">AC Sleeper</option>
              <option value="Non-AC">Non-AC Seater</option>
            </select>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
            Publish Trip
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTrip;