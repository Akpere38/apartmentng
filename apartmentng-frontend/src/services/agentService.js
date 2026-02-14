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