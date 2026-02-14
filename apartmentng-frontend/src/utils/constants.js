// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'apartmentng_token',
  USER: 'apartmentng_user',
  ROLE: 'apartmentng_role'
};

// Roles
export const ROLES = {
  ADMIN: 'admin',
  AGENT: 'agent'
};