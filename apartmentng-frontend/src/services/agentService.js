import api from './api';

// Get all agents (admin only)
export const getAllAgents = async () => {
  const response = await api.get('/agents');
  return response.data;
};

// Approve agent (admin only)
export const approveAgent = async (id, isApproved) => {
  const response = await api.put(`/agents/${id}/approve`, { is_approved: isApproved });
  return response.data;
};

// Delete agent (admin only)
export const deleteAgent = async (id) => {
  const response = await api.delete(`/agents/${id}`);
  return response.data;
};

// Get agent profile
export const getAgentProfile = async () => {
  const response = await api.get('/agents/profile');
  return response.data;
};

// Get agent by ID with apartments
export const getAgentById = async (id) => {
  const response = await api.get(`/agents/${id}`);
  return response.data;
};





// Get own profile agent
export const getAgentProfileAgent = async () => {
  const response = await api.get('/agents/me');
  return response.data;
};

// Update own profile agent
export const updateAgentProfile = async (data) => {
  const response = await api.put('/agents/me', data);
  return response.data;
};

// Change password
export const changeAgentPassword = async (data) => {
  const response = await api.put('/agents/me/password', data);
  return response.data;
};

// Upload document agent
export const uploadAgentDocument = async (documentType, file) => {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('document_type', documentType);

  const response = await api.post('/agents/me/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Delete documentagent
export const deleteAgentDocument = async (documentId) => {
  const response = await api.delete(`/agents/me/documents/${documentId}`);
  return response.data;
};