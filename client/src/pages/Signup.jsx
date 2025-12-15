import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ***************************************************************
// FINAL FIX: Define API_URL at the top of the file (module level).
// This ensures Vite can process it correctly during the Vercel build.
// ***************************************************************
const API_URL = import.meta.env.VITE_API_URL; 

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // The API call now uses the correct variable pointing to your Render URL
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    if (response.ok) {
      alert("Registration Successful! Please Login.");
      navigate('/');
    } else {
      // It's helpful to see the error status in development
      const errorText = await response.text();
      alert(`Registration Failed: ${response.status} - ${errorText}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=1471&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96 border border-white border-opacity-20">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Join Bus Yatri 🚌</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Full Name" 
            className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-orange-400"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="email" placeholder="Email Address" 
            className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-orange-400"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Password" 
            className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-orange-400"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition shadow-lg">
            Sign Up
          </button>
        </form>

        <p className="text-gray-200 text-center mt-4">
          Already have an account? <Link to="/" className="text-orange-300 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;