import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Star, CheckCircle, Clock } from 'lucide-react';

const ApartmentCard = ({ apartment }) => {
  const {
    id,
    title,
    location,
    bedrooms,
    bathrooms,
    price_per_night,
    is_featured,
    is_available,
    primary_image,
  } = apartment;

  return (
    <Link to={`/apartments/${id}`} className="group block">
      <div className="card-elevated overflow-hidden h-full">
        <div className="relative h-64 overflow-hidden bg-slate-200">
          {primary_image ? (
            <img
              src={primary_image}
              alt={title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <MapPin className="w-16 h-16 text-slate-400" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {is_featured === 1 && (
              <span className="badge bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-medium">
                <Star className="w-3 h-3 mr-1 fill-white" />
                Featured
              </span>
            )}
            {is_available === 1 ? (
              <span className="badge badge-success shadow-medium">
                <CheckCircle className="w-3 h-3 mr-1" />
                Available
              </span>
            ) : (
              <span className="badge badge-danger shadow-medium">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Booked
              </span>
            )}
          </div>

          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-medium">
            <p className="text-2xl font-bold text-gradient">
              ₦{price_per_night?.toLocaleString()}
            </p>
            <p className="text-xs text-slate-600 font-medium">per night</p>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-display font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-teal-600 transition-colors">
            {title}
          </h3>

          <div className="flex items-center text-slate-600 mb-4">
            <MapPin className="w-4 h-4 mr-2 text-teal-500 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-slate-700">
                <Bed className="w-5 h-5 mr-2 text-teal-500" />
                <span className="text-sm font-semibold">{bedrooms || 0}</span>
                <span className="text-xs text-slate-500 ml-1">beds</span>
              </div>
              <div className="flex items-center text-slate-700">
                <Bath className="w-5 h-5 mr-2 text-teal-500" />
                <span className="text-sm font-semibold">{bathrooms || 0}</span>
                <span className="text-xs text-slate-500 ml-1">baths</span>
              </div>
            </div>

            <div className="flex items-center text-teal-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
              View Details
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ApartmentCard;