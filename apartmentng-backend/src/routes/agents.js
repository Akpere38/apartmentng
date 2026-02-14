import express from 'express';
import { 
  register, 
  login, 
  getProfile, 
  getAllAgents,
  approveAgent,
  deleteAgent
} from '../controllers/agentController.js';
import { verifyToken, isAdmin, isAgent } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Agent-only routes
router.get('/profile', verifyToken, isAgent, getProfile);

// Admin-only routes (manage agents)
router.get('/', verifyToken, isAdmin, getAllAgents);
router.put('/:id/approve', verifyToken, isAdmin, approveAgent);
router.delete('/:id', verifyToken, isAdmin, deleteAgent);

export default router;