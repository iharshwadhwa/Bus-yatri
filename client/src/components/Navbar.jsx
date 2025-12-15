import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* --- BRAND LOGO (Now Red!) --- */}
        <Link to="/dashboard" className="flex items-center gap-2 text-2xl font-extrabold text-red-600 tracking-tighter hover:opacity-80 transition">
          <span className="text-3xl">🚌</span> 
          Bus Yatri
        </Link>

        {/* --- MENU ITEMS --- */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <span className="text-gray-500 font-medium hidden md:block">
                Welcome, <span className="text-gray-800 font-bold">{user.name}</span>
              </span>

              <Link to="/my-bookings" className="text-gray-600 font-semibold hover:text-red-600 transition">
                My Bookings
              </Link>

              {/* Show Add Trip only for admin/specific users if you want, currently showing for all */}
              <Link to="/add-trip" className="text-gray-600 font-semibold hover:text-red-600 transition">
                + Add Trip
              </Link>

              <button 
                onClick={handleLogout} 
                className="bg-red-100 text-red-600 px-5 py-2 rounded-full font-bold hover:bg-red-600 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/" className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 transition shadow-lg">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;