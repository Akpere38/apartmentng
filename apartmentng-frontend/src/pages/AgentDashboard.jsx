import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ApartmentForm from '../components/admin/ApartmentForm';
// import { getAgentApartments, getApartmentById, deleteApartment } from '../services/apartmentService';
import { getAgentApartments, getApartmentById, deleteApartment, toggleAvailability } from '../services/apartmentService';
import { Home, Plus, Edit2, Trash2, Eye, X } from 'lucide-react';

const AgentDashboard = () => {
  const { user } = useAuth();
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingApartment, setEditingApartment] = useState(null);
  const [editData, setEditData] = useState(null);

  const fetchApartments = async () => {
    try {
      setLoading(true);
      const data = await getAgentApartments();
      setApartments(data);
    } catch (error) {
      console.error('Failed to load apartments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  const handleEdit = async (id) => {
    try {
      const data = await getApartmentById(id);
      setEditData(data);
      setEditingApartment(id);
      setShowAddForm(false);
    } catch (error) {
      alert('Failed to load apartment details');
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteApartment(id);
        fetchApartments();
      } catch (error) {
        alert(error.response?.data?.error || 'Delete failed');
      }
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
  try {
    await toggleAvailability(id, !currentStatus);
    fetchApartments();
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to update availability');
  }
};

  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingApartment(null);
    setEditData(null);
    fetchApartments();
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingApartment(null);
    setEditData(null);
  };

  const stats = {
    total: apartments.length,
    approved: apartments.filter(a => a.is_approved === 1).length,
    pending: apartments.filter(a => a.is_approved === 0).length,
    available: apartments.filter(a => a.is_available === 1).length,
  };

  if (showAddForm || editingApartment) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1">
          <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-navy-700 text-white">
            <div className="container-custom py-12">
              <h1 className="text-4xl font-display font-bold mb-2">{editingApartment ? 'Edit Apartment' : 'Add New Apartment'}</h1>
              <p className="text-teal-100">{editingApartment ? 'Update your apartment details' : 'Create a new apartment listing'}</p>
            </div>
          </div>
          <div className="container-custom py-12">
            <div className="flex items-center justify-between mb-6">
              <button onClick={handleCancelForm} className="btn-secondary">
                <X className="w-5 h-5 mr-2" />Cancel
              </button>
            </div>
            <div className="card p-8">
              <ApartmentForm editData={editData} onSuccess={handleFormSuccess} onCancel={handleCancelForm} />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-navy-700 text-white">
          <div className="container-custom py-12">
            <h1 className="text-4xl font-display font-bold mb-2">Agent Dashboard</h1>
            <p className="text-teal-100">Welcome back, {user?.name || 'Agent'}</p>
          </div>
        </div>
        <div className="container-custom -mt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-teal-600" />
                </div>
                <span className="text-3xl font-bold text-slate-900">{stats.total}</span>
              </div>
              <p className="text-slate-600 font-medium">Total Listings</p>
            </div>
            <div className="card-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-3xl font-bold text-slate-900">{stats.approved}</span>
              </div>
              <p className="text-slate-600 font-medium">Approved</p>
            </div>
            <div className="card-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span className="text-3xl font-bold text-slate-900">{stats.pending}</span>
              </div>
              <p className="text-slate-600 font-medium">Pending Approval</p>
            </div>
            <div className="card-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span className="text-3xl font-bold text-slate-900">{stats.available}</span>
              </div>
              <p className="text-slate-600 font-medium">Available</p>
            </div>
          </div>
        </div>
        <div className="container-custom pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-display font-bold text-slate-900">My Apartments</h2>
            <button onClick={() => setShowAddForm(true)} className="btn-primary">
              <Plus className="w-5 h-5 mr-2" />Add New Apartment
            </button>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : apartments.length === 0 ? (
            <div className="card p-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
                <Home className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No Apartments Yet</h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">Start building your portfolio by adding your first apartment listing</p>
              <button onClick={() => setShowAddForm(true)} className="btn-primary">
                <Plus className="w-5 h-5 mr-2" />Create Your First Listing
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {apartments.map((apartment) => (
                <div key={apartment.id} className="card p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-48 h-48 flex-shrink-0">
                      {apartment.primary_image ? (
                        <img src={apartment.primary_image} alt={apartment.title} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <div className="w-full h-full bg-slate-200 rounded-xl flex items-center justify-center">
                          <span className="text-slate-400">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">{apartment.title}</h3>
                          <p className="text-slate-600 text-sm mb-2">{apartment.location}</p>
                          <p className="text-2xl font-bold text-teal-600">₦{apartment.price_per_night?.toLocaleString()}/night</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {apartment.is_approved === 1 ? (
                            <span className="badge badge-success">Approved</span>
                          ) : (
                            <span className="badge badge-warning">Pending Approval</span>
                          )}
                          {apartment.is_available === 1 ? (
                              <span className="badge badge-success">Available</span>
                            ) : (
                              <span className="badge badge-danger">Booked</span>
                            )}
                        </div>
                      </div>
                            <div className="flex flex-wrap gap-2">
                            <a href={`/apartments/${apartment.id}`} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
                              <Eye className="w-4 h-4 mr-1" />View
                            </a>
                            <button onClick={() => handleEdit(apartment.id)} className="btn-ghost text-sm text-teal-600 hover:bg-teal-50">
                              <Edit2 className="w-4 h-4 mr-1" />Edit
                            </button>
                            <button onClick={() => handleToggleAvailability(apartment.id, apartment.is_available === 1)} className={`btn-ghost text-sm ${apartment.is_available === 1 ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}>
                              {apartment.is_available === 1 ? (
                                <>
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  Mark as Booked
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                  Mark Available
                                </>
                              )}
                            </button>
                            <button onClick={() => handleDelete(apartment.id, apartment.title)} className="btn-ghost text-sm text-red-600 hover:bg-red-50">
                              <Trash2 className="w-4 h-4 mr-1" />Delete
                            </button>
                          </div>
                      {apartment.is_approved === 0 && (
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-sm text-amber-800">⏳ Your listing is pending admin approval. You'll be notified once it's live.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AgentDashboard;