import { useState } from 'react';
import { Search, MapPin, Filter, X } from 'lucide-react';

const ApartmentFilters = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    featured: '',
    available: 'true',
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
      featured: '',
      available: 'true',
    };
    setFilters(resetFilters);
    onFilterChange({ available: 'true' });
  };

  const hasActiveFilters = filters.location || filters.featured;

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Location Search */}
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by location (e.g., Lagos, Abuja, Lekki)..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="input-field pl-12"
            />
          </div>

          {/* Filter Toggle Button (Mobile) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden btn-secondary"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 w-2 h-2 bg-teal-500 rounded-full" />
            )}
          </button>

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Featured Filter */}
            <select
              value={filters.featured}
              onChange={(e) => handleFilterChange('featured', e.target.value)}
              className="input-field min-w-[150px]"
            >
              <option value="">All Properties</option>
              <option value="true">Featured Only</option>
            </select>

            {/* Availability Filter */}
            <select
              value={filters.available}
              onChange={(e) => handleFilterChange('available', e.target.value)}
              className="input-field min-w-[150px]"
            >
              <option value="">All Status</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn-ghost whitespace-nowrap"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filter Dropdown */}
        {isOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-slate-200 space-y-4 animate-slide-down">
            {/* Featured Filter */}
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

            {/* Availability Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Availability
              </label>
              <select
                value={filters.available}
                onChange={(e) => handleFilterChange('available', e.target.value)}
                className="input-field"
              >
                <option value="">All Status</option>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn-secondary w-full"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </button>
            )}
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
              <button
                onClick={() => handleFilterChange('location', '')}
                className="ml-2 hover:text-teal-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.featured && (
            <span className="badge badge-teal">
              Featured Only
              <button
                onClick={() => handleFilterChange('featured', '')}
                className="ml-2 hover:text-teal-900"
              >
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