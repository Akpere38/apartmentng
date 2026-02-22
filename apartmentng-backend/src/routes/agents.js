import express from 'express';
import {
  agentRegister,
  agentLogin,
  getAllAgents,
  approveAgent,
  deleteAgent,
  getAgentById,
  getCurrentAgentProfile,
  updateCurrentAgentProfile,
  changeCurrentAgentPassword,
  uploadCurrentAgentDocument,
  deleteCurrentAgentDocument,
  verifyEmail,
  resendVerificationEmail,
  requestEmailChange,
  verifyNewEmail
} from '../controllers/agentController.js';
import { verifyToken, isAdmin, isAgent } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Agent registration
router.post('/register', agentRegister);

// Agent login
router.post('/login', agentLogin);

// Get all agents (admin only)
router.get('/', verifyToken, isAdmin, getAllAgents);

// Agent self-service routes (agent only)
router.get('/me', verifyToken, isAgent, getCurrentAgentProfile);
router.put('/me', verifyToken, isAgent, updateCurrentAgentProfile);
router.put('/me/password', verifyToken, isAgent, changeCurrentAgentPassword);
router.post('/me/documents', verifyToken, isAgent, upload.single('document'), uploadCurrentAgentDocument);
router.delete('/me/documents/:id', verifyToken, isAgent, deleteCurrentAgentDocument);

// Get agent by ID with apartments (admin only)
router.get('/:id', verifyToken, isAdmin, getAgentById);

// Approve/suspend agent (admin only)
router.put('/:id/approve', verifyToken, isAdmin, approveAgent);

// Delete agent (admin only)
router.delete('/:id', verifyToken, isAdmin, deleteAgent);


// Email verification routes
router.get('/verify/:token', verifyEmail);
router.post('/resend-verification', verifyToken, isAgent, resendVerificationEmail);
router.put('/me/request-email-change', verifyToken, isAgent, requestEmailChange);
router.get('/verify-new-email/:token', verifyNewEmail);
export default router;