import { useState } from 'react';
import { Edit2, Trash2, Eye, CheckCircle, XCircle, Star } from 'lucide-react';
import { toggleAvailability, toggleFeatured, approveApartment, deleteApartment, getApartmentById } from '../../services/apartmentService';
import ApartmentForm from './ApartmentForm';

const AdminApartmentList = ({ apartments, onUpdate }) => {
  const [loading, setLoading] = useState({});
  const [editingApartment, setEditingApartment] = useState(null);
  const [editData, setEditData] = useState(null);

  const handleToggle = async (id, action, currentValue) => {
    setLoading({ ...loading, [id]: true });
    try {
      if (action === 'availability') {
        await toggleAvailability(id, !currentValue);
      } else if (action === 'featured') {
        await toggleFeatured(id, !currentValue);
      } else if (action === 'approve') {
        await approveApartment(id, !currentValue);
      }
      onUpdate();
    } catch (error) {
      alert(error.response?.data?.error || 'Action failed');
    } finally {
      setLoading({ ...loading, [id]: false });
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setLoading({ ...loading, [id]: true });
      try {
        await deleteApartment(id);
        onUpdate();
      } catch (error) {
        alert(error.response?.data?.error || 'Delete failed');
      } finally {
        setLoading({ ...loading, [id]: false });
      }
    }
  };

  const handleEdit = async (id) => {
    try {
      const data = await getApartmentById(id);
      setEditData(data);
      setEditingApartment(id);
    } catch (error) {
      alert('Failed to load apartment details');
    }
  };

  const handleEditSuccess = () => {
    setEditingApartment(null);
    setEditData(null);
    onUpdate();
  };

  if (editingApartment && editData) {
    return (
      <div className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-900">Edit Apartment</h3>
          <button onClick={() => { setEditingApartment(null); setEditData(null); }} className="btn-secondary">
            Cancel
          </button>
        </div>
        <ApartmentForm editData={editData} onSuccess={handleEditSuccess} onCancel={() => { setEditingApartment(null); setEditData(null); }} />
      </div>
    );
  }

  if (!apartments || apartments.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-slate-600">No apartments found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {apartments.map((apartment) => (
        <div key={apartment.id} className="card p-6 hover:shadow-medium transition-shadow">
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
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">
                      {apartment.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-2 line-clamp-2">
                      {apartment.location}
                    </p>
                    <p className="text-2xl font-bold text-teal-600">
                      ₦{apartment.price_per_night?.toLocaleString()}/night
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {apartment.is_featured ? (
                      <span className="badge bg-amber-100 text-amber-700">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </span>
                    ) : null}
                    {apartment.is_available ? (
                      <span className="badge badge-success">Available</span>
                    ) : (
                      <span className="badge badge-danger">Booked</span>
                    )}
                    {apartment.is_approved ? (
                      <span className="badge badge-success">Approved</span>
                    ) : (
                      <span className="badge badge-warning">Pending</span>
                    )}
                    {apartment.created_by === 'agent' && (
                      <span className="badge badge-navy">Agent Listing</span>
                    )}
                  </div>
                </div>

                {/* Agent Info Bar - NEW */}
{apartment.created_by === 'agent' && apartment.agent_name && (
  <div className="mb-4 p-4 bg-gradient-to-r from-navy-50 to-teal-50 border border-navy-200 rounded-xl">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-start sm:items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-navy-600 to-navy-700 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">
            {apartment.agent_name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-navy-600 mb-0.5">Managed By</p>
          <p className="font-bold text-slate-900 truncate">{apartment.agent_name}</p>
          {apartment.agent_company && (
            <p className="text-xs text-slate-600 truncate">{apartment.agent_company}</p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {apartment.agent_phone && (
          
            <a href={`tel:${apartment.agent_phone}`}
            className="inline-flex items-center px-3 py-1.5 bg-white hover:bg-teal-50 border border-teal-200 rounded-lg text-xs font-medium text-teal-700 transition-colors"
          >
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call
          </a>
        )}
        {apartment.agent_email && (
          
            <a href={`mailto:${apartment.agent_email}?subject=Regarding ${apartment.title}`}
            className="inline-flex items-center px-3 py-1.5 bg-white hover:bg-navy-50 border border-navy-200 rounded-lg text-xs font-medium text-navy-700 transition-colors"
          >
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email
          </a>
        )}
      </div>
    </div>
  </div>
)}

{apartment.created_by === 'admin' && (
  <div className="mb-4 p-3 bg-gradient-to-r from-teal-50 to-teal-100 border border-teal-200 rounded-xl">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <div>
        <p className="text-xs font-semibold text-teal-700">Platform Listing</p>
        <p className="text-sm font-medium text-teal-900">Managed by Apartment NG</p>
      </div>
    </div>
  </div>
)}

                {apartment.created_by === 'admin' && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-teal-50 to-teal-100 border border-teal-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-700 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-teal-700">Platform Listing</p>
                        <p className="text-sm font-medium text-teal-900">Managed by Apartment NG</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={`/apartments/${apartment.id}`} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
                  <Eye className="w-4 h-4 mr-1" />View
                </a>
                <button onClick={() => handleEdit(apartment.id)} disabled={loading[apartment.id]} className="btn-ghost text-sm text-teal-600 hover:bg-teal-50">
                  <Edit2 className="w-4 h-4 mr-1" />Edit
                </button>
                <button onClick={() => handleToggle(apartment.id, 'availability', apartment.is_available)} disabled={loading[apartment.id]} className={`btn-ghost text-sm ${apartment.is_available ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}>
                  {apartment.is_available ? (
                      <>
                        <XCircle className="w-4 h-4 mr-1" />
                        Mark as Booked
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark Available
                      </>
                    )}
                </button>
                <button onClick={() => handleToggle(apartment.id, 'featured', apartment.is_featured)} disabled={loading[apartment.id]} className="btn-ghost text-sm text-amber-600 hover:bg-amber-50">
                  <Star className="w-4 h-4 mr-1" />{apartment.is_featured ? 'Unfeature' : 'Feature'}
                </button>
                {!apartment.is_approved && (
                  <button onClick={() => handleToggle(apartment.id, 'approve', apartment.is_approved)} disabled={loading[apartment.id]} className="btn-ghost text-sm text-teal-600 hover:bg-teal-50">
                    <CheckCircle className="w-4 h-4 mr-1" />Approve
                  </button>
                )}
                <button onClick={() => handleDelete(apartment.id, apartment.title)} disabled={loading[apartment.id]} className="btn-ghost text-sm text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-1" />Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminApartmentList;