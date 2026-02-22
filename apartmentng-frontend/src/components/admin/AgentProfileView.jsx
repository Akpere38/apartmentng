import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAgentById, approveAgent, deleteAgent } from '../../services/agentService';
import { toggleAvailability, toggleFeatured, approveApartment, deleteApartment } from '../../services/apartmentService';
import LoadingSpinner from '../common/LoadingSpinner';
import { ArrowLeft, Phone, Mail, Building, Calendar, CheckCircle, XCircle, Star, Eye, Edit2, Trash2, User } from 'lucide-react';

const AgentProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchAgentData();
  }, [id]);

  const fetchAgentData = async () => {
    try {
      setLoading(true);
      const response = await getAgentById(id);
      setData(response);
    } catch (error) {
      alert('Failed to load agent profile');
      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendAgent = async () => {
    if (window.confirm(`Are you sure you want to ${data.agent.is_approved ? 'suspend' : 'activate'} this agent?`)) {
      try {
        await approveAgent(id, !data.agent.is_approved);
        fetchAgentData();
      } catch (error) {
        alert('Action failed');
      }
    }
  };

  const handleDeleteAgent = async () => {
    if (window.confirm(`Are you sure you want to DELETE ${data.agent.name}? This will also delete all their apartments!`)) {
      try {
        await deleteAgent(id);
        navigate('/admin/dashboard');
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  const handleApartmentAction = async (apartmentId, action, currentValue) => {
    setActionLoading({ ...actionLoading, [apartmentId]: true });
    try {
      if (action === 'availability') {
        await toggleAvailability(apartmentId, !currentValue);
      } else if (action === 'featured') {
        await toggleFeatured(apartmentId, !currentValue);
      } else if (action === 'approve') {
        await approveApartment(apartmentId, !currentValue);
      } else if (action === 'delete') {
        if (window.confirm('Delete this apartment?')) {
          await deleteApartment(apartmentId);
        }
      }
      fetchAgentData();
    } catch (error) {
      alert('Action failed');
    } finally {
      setActionLoading({ ...actionLoading, [apartmentId]: false });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  const { agent, apartments, stats } = data;

  const filteredApartments = apartments.filter(apt => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'approved') return apt.is_approved === 1;
    if (activeFilter === 'pending') return apt.is_approved === 0;
    if (activeFilter === 'available') return apt.is_available === 1;
    if (activeFilter === 'booked') return apt.is_available === 0;
    return true;
  });

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/admin/dashboard')} className="btn-ghost">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Dashboard
      </button>

      <div className="card-elevated p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-navy-600 to-navy-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-medium">
            <span className="text-white font-bold text-4xl">
              {agent.name?.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{agent.name}</h1>
                {agent.company_name && (
                  <p className="text-lg text-slate-600 flex items-center gap-2 mb-2">
                    <Building className="w-5 h-5 text-teal-500" />
                    {agent.company_name}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">
                    Joined {new Date(agent.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {agent.is_approved === 1 ? (
                  <span className="badge badge-success">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active Agent
                  </span>
                ) : (
                  <span className="badge badge-warning">
                    <XCircle className="w-3 h-3 mr-1" />
                    Suspended
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-600">Phone</p>
                  <p className="font-semibold text-slate-900">{agent.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-navy-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-600">Email</p>
                  <p className="font-semibold text-slate-900 truncate text-sm">{agent.email}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {agent.phone && (
                <a href={`tel:${agent.phone}`} className="btn-primary">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Agent
                </a>
              )}
              <a href={`mailto:${agent.email}?subject=Message from Apartment NG Admin`} className="btn-secondary">
                <Mail className="w-5 h-5 mr-2" />
                Email Agent
              </a>
              <button onClick={handleSuspendAgent} className={`btn-ghost ${agent.is_approved ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}>
                {agent.is_approved ? (
                  <>
                    <XCircle className="w-5 h-5 mr-2" />
                    Suspend Agent
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Activate Agent
                  </>
                )}
              </button>
              <button onClick={handleDeleteAgent} className="btn-ghost text-red-600 hover:bg-red-50">
                <Trash2 className="w-5 h-5 mr-2" />
                Delete Agent
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-slate-900">{stats.total_apartments}</p>
          <p className="text-sm text-slate-600">Total Listings</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-emerald-600">{stats.approved_apartments}</p>
          <p className="text-sm text-slate-600">Approved</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-amber-600">{stats.pending_apartments}</p>
          <p className="text-sm text-slate-600">Pending</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-teal-600">{stats.available_apartments}</p>
          <p className="text-sm text-slate-600">Available</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-orange-600">{stats.booked_apartments}</p>
          <p className="text-sm text-slate-600">Booked</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{stats.featured_apartments}</p>
          <p className="text-sm text-slate-600">Featured</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Agent's Apartments</h2>
        </div>

        <div className="card p-3 inline-flex gap-2 mb-6">
          {[
            { id: 'all', label: 'All', count: stats.total_apartments },
            { id: 'approved', label: 'Approved', count: stats.approved_apartments },
            { id: 'pending', label: 'Pending', count: stats.pending_apartments },
            { id: 'available', label: 'Available', count: stats.available_apartments },
            { id: 'booked', label: 'Booked', count: stats.booked_apartments }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeFilter === filter.id
                  ? 'bg-teal-600 text-white shadow-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        {filteredApartments.length === 0 ? (
          <div className="card p-12 text-center">
            <User className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600">No apartments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApartments.map(apartment => (
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
                        {apartment.is_featured === 1 && (
                          <span className="badge bg-amber-100 text-amber-700">
                            <Star className="w-3 h-3 mr-1" />Featured
                          </span>
                        )}
                        {apartment.is_available === 1 ? (
                          <span className="badge badge-success">Available</span>
                        ) : (
                          <span className="badge badge-danger">Booked</span>
                        )}
                        {apartment.is_approved === 1 ? (
                          <span className="badge badge-success">Approved</span>
                        ) : (
                          <span className="badge badge-warning">Pending</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <a href={`/apartments/${apartment.id}`} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
                        <Eye className="w-4 h-4 mr-1" />View
                      </a>
                      <button onClick={() => handleApartmentAction(apartment.id, 'availability', apartment.is_available === 1)} disabled={actionLoading[apartment.id]} className={`btn-ghost text-sm ${apartment.is_available === 1 ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}>
                        {apartment.is_available === 1 ? 'Mark Booked' : 'Mark Available'}
                      </button>
                      <button onClick={() => handleApartmentAction(apartment.id, 'featured', apartment.is_featured === 1)} disabled={actionLoading[apartment.id]} className="btn-ghost text-sm text-amber-600 hover:bg-amber-50">
                        <Star className="w-4 h-4 mr-1" />{apartment.is_featured === 1 ? 'Unfeature' : 'Feature'}
                      </button>
                      {apartment.is_approved === 0 && (
                        <button onClick={() => handleApartmentAction(apartment.id, 'approve', apartment.is_approved === 1)} disabled={actionLoading[apartment.id]} className="btn-ghost text-sm text-teal-600 hover:bg-teal-50">
                          <CheckCircle className="w-4 h-4 mr-1" />Approve
                        </button>
                      )}
                      <button onClick={() => handleApartmentAction(apartment.id, 'delete')} disabled={actionLoading[apartment.id]} className="btn-ghost text-sm text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4 mr-1" />Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentProfileView;