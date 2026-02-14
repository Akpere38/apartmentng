import { useState } from 'react';
import { useApartments } from '../hooks/useApartments';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ApartmentGrid from '../components/apartments/ApartmentGrid';
import ApartmentFilters from '../components/apartments/ApartmentFilters';
import { Sparkles, TrendingUp, Shield, Award } from 'lucide-react';

const Home = () => {
  const [filters, setFilters] = useState({ available: 'true' });
  const { apartments, loading, error } = useApartments(filters);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-hero overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-teal-400 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-navy-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative container-custom section-padding text-center text-white">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8 animate-slide-down">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-semibold">Nigeria's Premier Short-Let Platform</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-slide-up">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-amber-200">
                Home Away From Home
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-teal-50 mb-12 max-w-3xl mx-auto animate-fade-in">
              Discover luxury short-let apartments across Nigeria. Curated stays for business, leisure, and everything in between.
            </p>

  

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-slide-up">
              <div>
                <p className="text-4xl font-bold mb-1">{apartments.length}+</p>
                <p className="text-teal-100 text-sm">Properties</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-1">15+</p>
                <p className="text-teal-100 text-sm">Cities</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-1">100%</p>
                <p className="text-teal-100 text-sm">Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 md:h-24 text-slate-50" preserveAspectRatio="none" viewBox="0 0 1440 74" fill="currentColor">
            <path d="M0,32L48,37.3C96,43,192,53,288,56C384,59,480,53,576,48C672,43,768,37,864,37.3C960,37,1056,43,1152,45.3C1248,48,1344,48,1392,48L1440,48L1440,74L1392,74C1344,74,1248,74,1152,74C1056,74,960,74,864,74C768,74,672,74,576,74C480,74,384,74,288,74C192,74,96,74,48,74L0,74Z" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-8 text-center group hover:shadow-strong transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">100% Verified</h3>
            <p className="text-slate-600">All properties are thoroughly verified and vetted for your safety and comfort.</p>
          </div>

          <div className="card p-8 text-center group hover:shadow-strong transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-navy-100 to-navy-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Award className="w-8 h-8 text-navy-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Premium Quality</h3>
            <p className="text-slate-600">Handpicked apartments that meet our high standards of luxury and convenience.</p>
          </div>

          <div className="card p-8 text-center group hover:shadow-strong transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Best Rates</h3>
            <p className="text-slate-600">Competitive pricing with transparent costs and no hidden fees.</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="apartments" className="flex-1 container-custom py-16">
        <div className="mb-12">
          <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">
            Explore Available Apartments
          </h2>
          <p className="text-lg text-slate-600">
            Browse our collection of premium short-let apartments across Nigeria
          </p>
        </div>

        <ApartmentFilters onFilterChange={handleFilterChange} />
        <ApartmentGrid apartments={apartments} loading={loading} error={error} />

        {/* Results Summary */}
        {!loading && apartments.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-slate-600">
              Showing <span className="font-semibold text-teal-600">{apartments.length}</span> {apartments.length === 1 ? 'property' : 'properties'}
            </p>
          </div>
        )}
      </main>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-navy-800 via-navy-900 to-slate-900 text-white">
        <div className="container-custom section-padding text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Own a Property?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join our network of property managers and agents. List your apartments and reach thousands of potential guests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/agent/register" className="btn-primary bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700">
                Become an Agent
              </a>
              <a href="/agent/login" className="btn-secondary bg-white/10 hover:bg-white/20 text-white border-white/20">
                Agent Portal
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;