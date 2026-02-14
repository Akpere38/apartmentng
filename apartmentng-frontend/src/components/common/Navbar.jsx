import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, User, LogOut, Menu, X, Building2 } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { isAuthenticated, logout, user, isAdmin, isAgent } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-soft">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-navy-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-gradient">
                Apartment NG
              </h1>
              <p className="text-xs text-slate-500 -mt-1">Premium Stays</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/" className="btn-ghost">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>

            {!isAuthenticated ? (
              <>
                <Link to="/agent/register" className="btn-ghost">
                  Become an Agent
                </Link>
                <Link to="/agent/login" className="btn-secondary">
                  Agent Login
                </Link>
            
              </>
            ) : (
              <>
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/agent/dashboard'}
                  className="btn-ghost"
                >
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-secondary">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 animate-slide-down border-t border-slate-100">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg hover:bg-slate-50 flex items-center text-slate-700 font-medium"
              >
                <Home className="w-5 h-5 mr-3 text-teal-600" />
                Home
              </Link>

              {!isAuthenticated ? (
                <>
                  <Link
                    to="/agent/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                  >
                    Become an Agent
                  </Link>
                  <Link
                    to="/agent/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-lg bg-slate-100 text-slate-700 font-medium text-center"
                  >
                    Agent Login
                  </Link>
                  
                </>
              ) : (
                <>
                  <Link
                    to={isAdmin ? '/admin/dashboard' : '/agent/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-lg hover:bg-slate-50 flex items-center text-slate-700 font-medium"
                  >
                    <User className="w-5 h-5 mr-3 text-teal-600" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 font-medium"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;