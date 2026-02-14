import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const StickyBrowseButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Show button after scrolling down 300px
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsExpanded(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    if (location.pathname === '/') {
      // If on home page, smooth scroll to apartments
      const apartmentsSection = document.getElementById('apartments');
      if (apartmentsSection) {
        apartmentsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on other pages, navigate to home
      navigate('/#apartments');
    }
  };

  const handleBecomeAgent = () => {
    navigate('/agent/register');
    setIsExpanded(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay when expanded */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {isExpanded ? (
          // Expanded Menu
          <div className="animate-scale-in">
            <div className="card-elevated p-4 mb-4 min-w-[280px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">Quick Actions</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleClick}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-teal-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-teal-100 group-hover:bg-teal-200 rounded-lg flex items-center justify-center transition-colors">
                    <Search className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-slate-900">Browse Apartments</p>
                    <p className="text-xs text-slate-600">View all listings</p>
                  </div>
                </button>

                <button
                  onClick={handleBecomeAgent}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-navy-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-navy-100 group-hover:bg-navy-200 rounded-lg flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-slate-900">List Property</p>
                    <p className="text-xs text-slate-600">Become an agent</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Main FAB when expanded */}
            <button
              onClick={() => setIsExpanded(false)}
              className="w-14 h-14 bg-gradient-to-br from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 rounded-full shadow-strong flex items-center justify-center text-white transition-all hover:scale-110 ml-auto"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        ) : (
          // Collapsed FAB
          <button
            onClick={() => setIsExpanded(true)}
            className="group w-14 h-14 bg-gradient-to-br from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 rounded-full shadow-strong hover:shadow-glow-teal flex items-center justify-center text-white transition-all hover:scale-110 animate-float"
            aria-label="Quick actions"
          >
            <Search className="w-6 h-6" />
            
            {/* Pulse animation */}
            <span className="absolute inset-0 rounded-full bg-teal-400 opacity-0 group-hover:opacity-20 group-hover:animate-ping" />
          </button>
        )}
      </div>
    </>
  );
};

export default StickyBrowseButton;