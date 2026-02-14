import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AdminApartmentList from '../components/admin/AdminApartmentList';
import AgentManagement from '../components/admin/AgentManagement';
import ApartmentForm from '../components/admin/ApartmentForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Building2, Users, Home, TrendingUp, Plus, X } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('apartments');
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    featured: 0,
    pending: 0,
  });

const fetchApartments = async () => {
  setLoading(true);
  try {
    // Fetch ALL apartments including unapproved ones
    const token = localStorage.getItem('apartmentng_token');
    const response = await fetch('http://localhost:5000/api/apartments/admin/all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      // Fallback: fetch public apartments if admin endpoint doesn't exist yet
      const publicResponse = await fetch('http://localhost:5000/api/apartments');
      const publicData = await publicResponse.json();
      setApartments(publicData);
      
      setStats({
        total: publicData.length,
        available: publicData.filter(a => a.is_available === 1).length,
        featured: publicData.filter(a => a.is_featured === 1).length,
        pending: publicData.filter(a => a.is_approved === 0).length,
      });
    } else {
      const data = await response.json();
      setApartments(data);

      // Calculate stats
      setStats({
        total: data.length,
        available: data.filter(a => a.is_available === 1).length,
        featured: data.filter(a => a.is_featured === 1).length,
        pending: data.filter(a => a.is_approved === 0).length,
      });
    }
  } catch (error) {
    console.error('Failed to load apartments:', error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchApartments();
  }, []);

  const tabs = [
    { id: 'apartments', label: 'Apartments', icon: Building2 },
    { id: 'agents', label: 'Agents', icon: Users },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-br from-navy-800 via-navy-900 to-slate-900 text-white">
          <div className="container-custom py-12">
            <h1 className="text-4xl font-display font-bold mb-2">
              Admin Dashboard
            </h1>
            <p className="text-navy-200">
              Welcome back, {user?.name || 'Admin'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="container-custom -mt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-teal-600" />
                </div>
                <span className="text-3xl font-bold text-slate-900">{stats.total}</span>
              </div>
              <p className="text-slate-600 font-medium">Total Apartments</p>
            </div>

            <div className="card-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="text-3xl font-bold text-slate-900">{stats.available}</span>
              </div>
              <p className="text-slate-600 font-medium">Available</p>
            </div>

            <div className="card-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-amber-600" />
                </div>
                <span className="text-3xl font-bold text-slate-900">{stats.featured}</span>
              </div>
              <p className="text-slate-600 font-medium">Featured</p>
            </div>

            <div className="card-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-3xl font-bold text-slate-900">{stats.pending}</span>
              </div>
              <p className="text-slate-600 font-medium">Pending Approval</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="container-custom mb-8">
          <div className="card p-2 inline-flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5 inline mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="container-custom pb-16">
          {activeTab === 'apartments' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  All Apartments
                </h2>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="btn-primary"
                >
                  {showAddForm ? (
                    <>
                      <X className="w-5 h-5 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Add New Apartment
                    </>
                  )}
                </button>
              </div>

              {/* Add Apartment Form */}
              {showAddForm && (
                <div className="mb-8 animate-slide-down">
                  <div className="card p-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">
                      Add New Apartment
                    </h3>
                    <ApartmentForm
                      onSuccess={() => {
                        setShowAddForm(false);
                        fetchApartments();
                      }}
                      onCancel={() => setShowAddForm(false)}
                    />
                  </div>
                </div>
              )}

              {/* Apartment List */}
              {loading ? (
                <LoadingSpinner />
              ) : (
                <AdminApartmentList apartments={apartments} onUpdate={fetchApartments} />
              )}
            </div>
          )}

          {activeTab === 'agents' && <AgentManagement />}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;