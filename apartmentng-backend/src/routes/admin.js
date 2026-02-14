import express from 'express';
import { login, getProfile, updatePassword } from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes (require admin authentication)
router.get('/profile', verifyToken, isAdmin, getProfile);
router.put('/password', verifyToken, isAdmin, updatePassword);

export default router;