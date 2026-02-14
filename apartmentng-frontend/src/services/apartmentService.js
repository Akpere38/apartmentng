import api from './api';

// Get all apartments (public)
export const getAllApartments = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.featured !== undefined) params.append('featured', filters.featured);
  if (filters.available !== undefined) params.append('available', filters.available);
  if (filters.location) params.append('location', filters.location);
  
  const response = await api.get(`/apartments?${params.toString()}`);
  return response.data;
};

// Get apartment by ID
export const getApartmentById = async (id) => {
  const response = await api.get(`/apartments/${id}`);
  return response.data;
};

// Create apartment (admin/agent)
export const createApartment = async (apartmentData) => {
  const response = await api.post('/apartments', apartmentData);
  return response.data;
};

// Update apartment (admin/agent)
export const updateApartment = async (id, apartmentData) => {
  const response = await api.put(`/apartments/${id}`, apartmentData);
  return response.data;
};

// Delete apartment (admin/agent)
export const deleteApartment = async (id) => {
  const response = await api.delete(`/apartments/${id}`);
  return response.data;
};

// Upload images
export const uploadImages = async (apartmentId, files) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });
  
  const response = await api.post(`/apartments/${apartmentId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Upload video
export const uploadVideo = async (apartmentId, file) => {
  const formData = new FormData();
  formData.append('video', file);
  
  const response = await api.post(`/apartments/${apartmentId}/videos`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Delete image
export const deleteImage = async (apartmentId, imageId) => {
  const response = await api.delete(`/apartments/${apartmentId}/images/${imageId}`);
  return response.data;
};

// Delete video
export const deleteVideo = async (apartmentId, videoId) => {
  const response = await api.delete(`/apartments/${apartmentId}/videos/${videoId}`);
  return response.data;
};

// Toggle availability (admin only)
export const toggleAvailability = async (id, isAvailable) => {
  const response = await api.put(`/apartments/${id}/availability`, { is_available: isAvailable });
  return response.data;
};

// Toggle featured (admin only)
export const toggleFeatured = async (id, isFeatured) => {
  const response = await api.put(`/apartments/${id}/featured`, { is_featured: isFeatured });
  return response.data;
};

// Approve apartment (admin only)
export const approveApartment = async (id, isApproved) => {
  const response = await api.put(`/apartments/${id}/approve`, { is_approved: isApproved });
  return response.data;
};

// Get agent's apartments
export const getAgentApartments = async () => {
  const response = await api.get('/apartments/agent/my-apartments');
  return response.data;
};