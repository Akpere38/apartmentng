import { useState } from 'react';
import { Search, MapPin, Filter, X, Bed, Bath, ArrowUpDown } from 'lucide-react';


const ApartmentFilters = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    min_price: '',
    max_price: '',
    bedrooms: '',
    bathrooms: '',
    featured: '',
    available: 'true',
    sort_by: '',
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Only pass non-empty values to parent
    const activeFilters = {};
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k]) activeFilters[k] = newFilters[k];
    });
    
    onFilterChange(activeFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      location: '',
      min_price: '',
      max_price: '',
      bedrooms: '',
      bathrooms: '',
      featured: '',
      available: 'true',
      sort_by: '',
    };
    setFilters(resetFilters);
    onFilterChange({ available: 'true' });
  };

  const hasActiveFilters = filters.location || filters.min_price || filters.max_price || 
                          filters.bedrooms || filters.bathrooms || filters.featured || 
                          filters.sort_by;

  const formatPrice = (value) => {
    return value ? `₦${parseInt(value).toLocaleString()}` : '';
  };

  return (
    <div className="mb-8">
      {/* Main Search Card */}
      <div className="card p-6">
        <div className="flex flex-col gap-4">
          {/* Location Search */}
          <div className="relative flex-1">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by location (e.g., Lagos, Abuja, Lekki)..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="input-field pl-12"
            />
          </div>

          {/* Desktop Filters Row */}
          <div className="hidden lg:grid lg:grid-cols-6 gap-4">


            {/* Price Range */}
            {/* Price Range */}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₦</span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.min_price}
                        onChange={(e) => handleFilterChange('min_price', e.target.value)}
                        className="input-field pl-8 text-sm"
                        min="0"
                        step="1000"
                      />
                    </div>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₦</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.max_price}
                        onChange={(e) => handleFilterChange('max_price', e.target.value)}
                        className="input-field pl-8 text-sm"
                        min="0"
                        step="1000"
                      />
                    </div>
                  </div>
                  {(filters.min_price || filters.max_price) && (
                    <p className="text-xs text-teal-600 mt-1">
                      {formatPrice(filters.min_price || '0')} - {formatPrice(filters.max_price || '1000000')}
                    </p>
                  )}
                </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Bedrooms
              </label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                className="input-field text-sm"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Bathrooms
              </label>
              <select
                value={filters.bathrooms}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                className="input-field text-sm"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sort_by}
                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                className="input-field text-sm"
              >
                <option value="">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="bedrooms">Most Bedrooms</option>
              </select>
            </div>

            {/* Clear Button */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <button onClick={clearFilters} className="btn-ghost w-full">
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="btn-secondary flex-1"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 w-2 h-2 bg-teal-500 rounded-full" />
              )}
            </button>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-ghost">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filters Dropdown */}
        {isOpen && (
          <div className="lg:hidden mt-6 pt-6 border-t border-slate-200 space-y-4 animate-slide-down">

            
                {/* Price Range */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Price Range
            </label>
            <div className="space-y-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₦</span>
                <input
                  type="number"
                  placeholder="Minimum Price"
                  value={filters.min_price}
                  onChange={(e) => handleFilterChange('min_price', e.target.value)}
                  className="input-field pl-9"
                  min="0"
                  step="1000"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₦</span>
                <input
                  type="number"
                  placeholder="Maximum Price"
                  value={filters.max_price}
                  onChange={(e) => handleFilterChange('max_price', e.target.value)}
                  className="input-field pl-9"
                  min="0"
                  step="1000"
                />
              </div>
              {(filters.min_price || filters.max_price) && (
                <div className="p-3 bg-teal-50 rounded-lg">
                  <p className="text-sm text-teal-700 font-medium">
                    {formatPrice(filters.min_price || '0')} - {formatPrice(filters.max_price || '1000000')}
                  </p>
                </div>
              )}
            </div>
          </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Bedrooms
              </label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                className="input-field"
              >
                <option value="">Any Bedrooms</option>
                <option value="1">1+ Bedrooms</option>
                <option value="2">2+ Bedrooms</option>
                <option value="3">3+ Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Bathrooms
              </label>
              <select
                value={filters.bathrooms}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                className="input-field"
              >
                <option value="">Any Bathrooms</option>
                <option value="1">1+ Bathrooms</option>
                <option value="2">2+ Bathrooms</option>
                <option value="3">3+ Bathrooms</option>
                <option value="4">4+ Bathrooms</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sort_by}
                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                className="input-field"
              >
                <option value="">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="bedrooms">Most Bedrooms</option>
              </select>
            </div>

            {/* Featured Toggle */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Property Type
              </label>
              <select
                value={filters.featured}
                onChange={(e) => handleFilterChange('featured', e.target.value)}
                className="input-field"
              >
                <option value="">All Properties</option>
                <option value="true">Featured Only</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-600 font-medium">Active Filters:</span>
          {filters.location && (
            <span className="badge badge-teal">
              Location: {filters.location}
              <button onClick={() => handleFilterChange('location', '')} className="ml-2 hover:text-teal-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.min_price && (
            <span className="badge badge-teal">
              Min: {formatPrice(filters.min_price)}
              <button onClick={() => handleFilterChange('min_price', '')} className="ml-2 hover:text-teal-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.max_price && (
            <span className="badge badge-teal">
              Max: {formatPrice(filters.max_price)}
              <button onClick={() => handleFilterChange('max_price', '')} className="ml-2 hover:text-teal-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.bedrooms && (
            <span className="badge badge-teal">
              {filters.bedrooms}+ Bedrooms
              <button onClick={() => handleFilterChange('bedrooms', '')} className="ml-2 hover:text-teal-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.bathrooms && (
            <span className="badge badge-teal">
              {filters.bathrooms}+ Bathrooms
              <button onClick={() => handleFilterChange('bathrooms', '')} className="ml-2 hover:text-teal-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.sort_by && (
            <span className="badge badge-teal">
              Sort: {filters.sort_by.replace('_', ' ')}
              <button onClick={() => handleFilterChange('sort_by', '')} className="ml-2 hover:text-teal-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ApartmentFilters;