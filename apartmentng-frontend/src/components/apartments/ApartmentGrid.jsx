import ApartmentCard from './ApartmentCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { Home } from 'lucide-react';

const ApartmentGrid = ({ apartments, loading, error }) => {
  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Apartments</h3>
        <p className="text-slate-600">{error}</p>
      </div>
    );
  }

  if (!apartments || apartments.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
          <Home className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">No Apartments Found</h3>
        <p className="text-slate-600 max-w-md mx-auto">
          We couldn't find any apartments matching your criteria. Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
      {apartments.map((apartment) => (
        <div key={apartment.id} className="animate-slide-up">
          <ApartmentCard apartment={apartment} />
        </div>
      ))}
    </div>
  );
};

export default ApartmentGrid;