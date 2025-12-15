import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';          // <--- Your new Landing Page
import MyBookings from './pages/MyBookings'; 
import AddTrip from './pages/AddTrip';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Main App Routes */}
        {/* We point /dashboard to Home so users see the cool landing page after login */}
        <Route path="/dashboard" element={<Home />} /> 
        
        {/* User Features */}
        <Route path="/my-bookings" element={<MyBookings />} />
        
        {/* Admin Features */}
        <Route path="/add-trip" element={<AddTrip />} />
      </Routes>
    </Router>
  );
}

export default App;