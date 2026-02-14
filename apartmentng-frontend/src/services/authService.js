import api from './api';
import { STORAGE_KEYS } from '../utils/constants';

// Admin login
export const adminLogin = async (email, password) => {
  const response = await api.post('/admin/login', { email, password });
  
  // Store token and user info
  localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.admin));
  localStorage.setItem(STORAGE_KEYS.ROLE, 'admin');
  
  return response.data;
};

// Agent login
export const agentLogin = async (email, password) => {
  const response = await api.post('/agents/login', { email, password });
  
  localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.agent));
  localStorage.setItem(STORAGE_KEYS.ROLE, 'agent');
  
  return response.data;
};

// Agent registration
export const agentRegister = async (data) => {
  const response = await api.post('/agents/register', data);
  return response.data;
};

// Logout
export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.ROLE);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  return userStr ? JSON.parse(userStr) : null;
};

// Get user role
export const getUserRole = () => {
  return localStorage.getItem(STORAGE_KEYS.ROLE);
};