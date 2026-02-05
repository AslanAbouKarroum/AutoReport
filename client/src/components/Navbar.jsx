import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Car, LogOut, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-400" />
            <span className="font-bold text-xl tracking-tight">AutoReport LB</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:text-blue-300 transition">Search</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-300 transition">Dashboard</Link>
                {user.role === 'admin' && (
                   <Link to="/admin" className="hover:text-blue-300 transition">Admin</Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition">
                <ShieldCheck className="h-4 w-4" />
                <span>Partner Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
