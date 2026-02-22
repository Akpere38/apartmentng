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

// Alias for getAgentProfileAgent
export const getMyProfile = getAgentProfileAgent;

// Update own profile agent
export const updateAgentProfile = async (data) => {
  const response = await api.put('/agents/me', data);
  return response.data;
};

// Alias for updateAgentProfile
export const updateMyProfile = updateAgentProfile;

// Change password
export const changeAgentPassword = async (data) => {
  const response = await api.put('/agents/me/password', data);
  return response.data;
};

// Alias for changeAgentPassword
export const changeMyPassword = changeAgentPassword;

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

// Alias for uploadAgentDocument
export const uploadMyDocument = uploadAgentDocument;

// Delete documentagent
export const deleteAgentDocument = async (documentId) => {
  const response = await api.delete(`/agents/me/documents/${documentId}`);
  return response.data;
};

// Alias for deleteAgentDocument
export const deleteMyDocument = deleteAgentDocument;

// Resend verification email
export const resendVerificationEmail = async () => {
  const response = await api.post('/agents/resend-verification');
  return response.data;
};

export const requestEmailChange = async (newEmail) => {
  const response = await api.put('/agents/me/request-email-change', { new_email: newEmail });
  return response.data;
};
