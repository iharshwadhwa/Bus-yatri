/* eslint-disable no-irregular-whitespace */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ***************************************************************
// FIX: Define API_URL at the top of the file (module level).
// This uses the Vercel Environment Variable: https://bus-yatri.onrender.com
// ***************************************************************
const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
 const [formData, setFormData] = useState({ email: '', password: '' });
 const navigate = useNavigate();

 const handleSubmit = async (e) => {
 e.preventDefault();

    // FINAL FIX: Using the live API_URL variable here!
 const response = await fetch(`${API_URL}/api/login`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(formData),
 });
const data = await response.json();
if (response.ok) {
localStorage.setItem('token', data.token); // Save the ID Card
 localStorage.setItem('user', JSON.stringify(data.user));
  alert("Login Successful!");
 navigate('/dashboard'); // Go to Dashboard
 } else {
 alert(data.error);
 }
 };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1469&auto=format&fit=crop')] bg-cover bg-center">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96 border border-white border-opacity-20">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Welcome Back 👋</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" placeholder="Email Address" 
            className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Password" 
            className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg">
            Login
          </button>
        </form>

        <p className="text-gray-200 text-center mt-4">
          Don't have an account? <Link to="/signup" className="text-blue-300 font-bold hover:underline">Sign Up</Link>
        </p>
 </div>
 </div>
 );
};

export default Login;