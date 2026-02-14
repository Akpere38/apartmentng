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
                  <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{apartment.title}</h3>
                  <p className="text-slate-600 text-sm mb-2 line-clamp-2">{apartment.location}</p>
                  <p className="text-2xl font-bold text-teal-600">₦{apartment.price_per_night?.toLocaleString()}/night</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {apartment.is_featured && (
                    <span className="badge bg-amber-100 text-amber-700">
                      <Star className="w-3 h-3 mr-1" />Featured
                    </span>
                  )}
                  {apartment.is_available ? (
                    <span className="badge badge-success">Available</span>
                  ) : (
                    <span className="badge badge-danger">Unavailable</span>
                  )}
                  {apartment.is_approved ? (
                    <span className="badge badge-success">Approved</span>
                  ) : (
                    <span className="badge badge-warning">Pending</span>
                  )}
                  {apartment.created_by === 'agent' && <span className="badge badge-navy">Agent Listing</span>}
                </div>
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