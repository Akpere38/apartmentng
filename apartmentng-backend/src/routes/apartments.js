import express from 'express';
import {
  getAllApartments,
  getApartmentById,
  createApartment,
  updateApartment,
  deleteApartment,
  toggleAvailability,
  toggleFeatured,
  approveApartment,
  uploadImages,
  uploadVideo,
  deleteImage,
  deleteVideo,
  getAgentApartments
} from '../controllers/apartmentController.js';
import { verifyToken, isAdmin, isAgent, isAdminOrAgent } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { query } from '../config/database.js';

const router = express.Router();

// Public routes (no authentication needed)
router.get('/', getAllApartments);

// Admin: Get ALL apartments (including unapproved) - MUST BE BEFORE /:id
router.get('/admin/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const apartments = await query(
      `SELECT a.*, 
        (SELECT image_url FROM apartment_images WHERE apartment_id = a.id AND is_primary = 1 LIMIT 1) as primary_image,
        (SELECT COUNT(*) FROM apartment_images WHERE apartment_id = a.id) as image_count
       FROM apartments a
       ORDER BY a.is_approved ASC, a.created_at DESC`
    );
    res.json(apartments);
  } catch (error) {
    console.error('Get all apartments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', getApartmentById);

// Rest of the routes...

// Protected routes (admin or agent)
router.post('/', verifyToken, isAdminOrAgent, createApartment);
router.put('/:id', verifyToken, isAdminOrAgent, updateApartment);
router.delete('/:id', verifyToken, isAdminOrAgent, deleteApartment);

// Image and video uploads
router.post('/:id/images', verifyToken, isAdminOrAgent, upload.array('images', 10), uploadImages);
router.post('/:id/videos', verifyToken, isAdminOrAgent, upload.single('video'), uploadVideo);
router.delete('/:id/images/:imageId', verifyToken, isAdminOrAgent, deleteImage);
router.delete('/:id/videos/:videoId', verifyToken, isAdminOrAgent, deleteVideo);

// Admin-only routes
router.put('/:id/availability', verifyToken, isAdminOrAgent, toggleAvailability);
router.put('/:id/featured', verifyToken, isAdmin, toggleFeatured);
router.put('/:id/approve', verifyToken, isAdmin, approveApartment);

// Agent routes
router.get('/agent/my-apartments', verifyToken, isAgent, getAgentApartments);

export default router;