import { query, run, get } from '../config/database.js';
import { uploadImage, uploadVideo as uploadVideoToCloudinary, deleteFile } from '../utils/cloudinaryHelper.js';

// Get all apartments (public - with filters)
// Get all apartments (public - with filters)
export const getAllApartments = async (req, res) => {
  try {
    const { 
      featured, 
      available, 
      location, 
      min_price, 
      max_price, 
      bedrooms, 
      bathrooms,
      sort_by 
    } = req.query;
    
    // Check if request is from an authenticated admin
    const isAdmin = req.user && req.user.role === 'admin';

    let sql = `
      SELECT a.*, 
        (SELECT image_url FROM apartment_images WHERE apartment_id = a.id AND is_primary = 1 LIMIT 1) as primary_image,
        (SELECT COUNT(*) FROM apartment_images WHERE apartment_id = a.id) as image_count
      FROM apartments a
    `;

    // Only show approved apartments for public/non-admin users
    if (!isAdmin) {
      sql += ' WHERE a.is_approved = 1';
    } else {
      sql += ' WHERE 1=1'; // Show all apartments for admin
    }

    const params = [];

    if (featured) {
      sql += ' AND a.is_featured = ?';
      params.push(featured === 'true' ? 1 : 0);
    }

    if (available) {
      sql += ' AND a.is_available = ?';
      params.push(available === 'true' ? 1 : 0);
    }

    if (location) {
      sql += ' AND a.location LIKE ?';
      params.push(`%${location}%`);
    }

    // Price range filter
    if (min_price) {
      sql += ' AND a.price_per_night >= ?';
      params.push(parseFloat(min_price));
    }

    if (max_price) {
      sql += ' AND a.price_per_night <= ?';
      params.push(parseFloat(max_price));
    }

    // Bedrooms filter
    if (bedrooms) {
      sql += ' AND a.bedrooms >= ?';
      params.push(parseInt(bedrooms));
    }

    // Bathrooms filter
    if (bathrooms) {
      sql += ' AND a.bathrooms >= ?';
      params.push(parseInt(bathrooms));
    }

    // Sorting
    let orderClause = '';
    if (isAdmin) {
      orderClause = ' ORDER BY a.is_approved ASC, ';
    } else {
      orderClause = ' ORDER BY ';
    }

    switch (sort_by) {
      case 'price_low':
        orderClause += 'a.price_per_night ASC, a.created_at DESC';
        break;
      case 'price_high':
        orderClause += 'a.price_per_night DESC, a.created_at DESC';
        break;
      case 'newest':
        orderClause += 'a.created_at DESC';
        break;
      case 'bedrooms':
        orderClause += 'a.bedrooms DESC, a.created_at DESC';
        break;
      default:
        orderClause += 'a.is_featured DESC, a.created_at DESC';
    }

    sql += orderClause;

    const apartments = await query(sql, params);
    res.json(apartments);
  } catch (error) {
    console.error('Get apartments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get apartment by ID (public)
export const getApartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const apartment = await get('SELECT * FROM apartments WHERE id = ?', [id]);

    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    // Get images
    const images = await query(
      'SELECT * FROM apartment_images WHERE apartment_id = ? ORDER BY is_primary DESC, display_order ASC',
      [id]
    );

    // Get videos
    const videos = await query('SELECT * FROM apartment_videos WHERE apartment_id = ?', [id]);

    res.json({
      ...apartment,
      images,
      videos
    });
  } catch (error) {
    console.error('Get apartment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create apartment
// Create apartment
export const createApartment = async (req, res) => {
  try {
    const { title, description, location, bedrooms, bathrooms, price_per_night, amenities } = req.body;

    if (!title || !location) {
      return res.status(400).json({ error: 'Title and location are required' });
    }

    const createdBy = req.user.role;
    const agentId = req.user.role === 'agent' ? req.user.id : null;
    const isApproved = req.user.role === 'admin' ? 1 : 0;

    const result = await run(
      `INSERT INTO apartments (title, description, location, bedrooms, bathrooms, price_per_night, amenities, created_by, agent_id, is_approved)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, location, bedrooms, bathrooms, price_per_night, amenities, createdBy, agentId, isApproved]
    );

    res.status(201).json({
      message: 'Apartment created successfully',
      apartment: {
        id: result.id,
        title,
        location,
        is_approved: isApproved
      }
    });
  } catch (error) {
    console.error('Create apartment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update apartment
// Update apartment
export const updateApartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, bedrooms, bathrooms, price_per_night, amenities } = req.body;

    // Check ownership
    const apartment = await get('SELECT * FROM apartments WHERE id = ?', [id]);

    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    // Agents can only edit their own apartments
    if (req.user.role === 'agent' && apartment.agent_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own apartments' });
    }

    await run(
      `UPDATE apartments 
       SET title = ?, description = ?, location = ?, bedrooms = ?, bathrooms = ?, price_per_night = ?, amenities = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, description, location, bedrooms, bathrooms, price_per_night, amenities, id]
    );

    res.json({ message: 'Apartment updated successfully' });
  } catch (error) {
    console.error('Update apartment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete apartment
export const deleteApartment = async (req, res) => {
  try {
    const { id } = req.params;

    const apartment = await get('SELECT * FROM apartments WHERE id = ?', [id]);

    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    if (req.user.role === 'agent' && apartment.agent_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own apartments' });
    }

    // Get all images and videos to delete from Cloudinary
    const images = await query('SELECT cloudinary_id FROM apartment_images WHERE apartment_id = ?', [id]);
    const videos = await query('SELECT cloudinary_id FROM apartment_videos WHERE apartment_id = ?', [id]);

    // Delete from Cloudinary
    for (const img of images) {
      if (img.cloudinary_id) await deleteFile(img.cloudinary_id, 'image');
    }
    for (const vid of videos) {
      if (vid.cloudinary_id) await deleteFile(vid.cloudinary_id, 'video');
    }

    // Delete apartment (CASCADE will delete images and videos from DB)
    await run('DELETE FROM apartments WHERE id = ?', [id]);

    res.json({ message: 'Apartment deleted successfully' });
  } catch (error) {
    console.error('Delete apartment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Toggle availability (admin only)
// Toggle availability (admin or agent for their own apartments)
export const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_available } = req.body;

    // Get apartment details
    const apartment = await get('SELECT * FROM apartments WHERE id = ?', [id]);

    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    // Check permissions: admin can toggle any, agent can toggle their own
    if (req.user.role === 'agent' && apartment.agent_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own apartments' });
    }

    await run('UPDATE apartments SET is_available = ? WHERE id = ?', [is_available ? 1 : 0, id]);

    res.json({ message: 'Availability updated' });
  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Toggle featured (admin only)
export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_featured } = req.body;

    await run('UPDATE apartments SET is_featured = ? WHERE id = ?', [is_featured ? 1 : 0, id]);

    res.json({ message: 'Featured status updated' });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Approve apartment (admin only)
export const approveApartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;

    await run('UPDATE apartments SET is_approved = ? WHERE id = ?', [is_approved ? 1 : 0, id]);

    res.json({ message: 'Apartment approval status updated' });
  } catch (error) {
    console.error('Approve apartment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Upload images
export const uploadImages = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    // Check ownership
    const apartment = await get('SELECT * FROM apartments WHERE id = ?', [id]);
    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    if (req.user.role === 'agent' && apartment.agent_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only upload images to your own apartments' });
    }

    // Get current image count for display order
    const currentImages = await query('SELECT MAX(display_order) as max_order FROM apartment_images WHERE apartment_id = ?', [id]);
    let displayOrder = (currentImages[0]?.max_order || 0) + 1;

    // Check if this is the first image (set as primary)
    const imageCount = await query('SELECT COUNT(*) as count FROM apartment_images WHERE apartment_id = ?', [id]);
    const isPrimary = imageCount[0].count === 0;

    const uploadedImages = [];

    for (const file of files) {
      const { url, cloudinary_id } = await uploadImage(file.path);

      const result = await run(
        'INSERT INTO apartment_images (apartment_id, image_url, cloudinary_id, is_primary, display_order) VALUES (?, ?, ?, ?, ?)',
        [id, url, cloudinary_id, isPrimary ? 1 : 0, displayOrder++]
      );

      uploadedImages.push({ id: result.id, url, cloudinary_id });
    }

    res.json({ message: 'Images uploaded successfully', images: uploadedImages });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ error: 'Server error uploading images' });
  }
};

// Upload video
export const uploadVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No video provided' });
    }

    const apartment = await get('SELECT * FROM apartments WHERE id = ?', [id]);
    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    if (req.user.role === 'agent' && apartment.agent_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only upload videos to your own apartments' });
    }

    const { url, cloudinary_id } = await uploadVideoToCloudinary(file.path);

    const result = await run(
      'INSERT INTO apartment_videos (apartment_id, video_url, cloudinary_id) VALUES (?, ?, ?)',
      [id, url, cloudinary_id]
    );

    res.json({ message: 'Video uploaded successfully', video: { id: result.id, url, cloudinary_id } });
  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({ error: 'Server error uploading video' });
  }
};

// Delete image
export const deleteImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;

    const image = await get('SELECT * FROM apartment_images WHERE id = ? AND apartment_id = ?', [imageId, id]);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const apartment = await get('SELECT * FROM apartments WHERE id = ?', [id]);
    if (req.user.role === 'agent' && apartment.agent_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete from Cloudinary
    if (image.cloudinary_id) {
      await deleteFile(image.cloudinary_id, 'image');
    }

    // Delete from DB
    await run('DELETE FROM apartment_images WHERE id = ?', [imageId]);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete video
export const deleteVideo = async (req, res) => {
  try {
    const { id, videoId } = req.params;

    const video = await get('SELECT * FROM apartment_videos WHERE id = ? AND apartment_id = ?', [videoId, id]);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const apartment = await get('SELECT * FROM apartments WHERE id = ?', [id]);
    if (req.user.role === 'agent' && apartment.agent_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete from Cloudinary
    if (video.cloudinary_id) {
      await deleteFile(video.cloudinary_id, 'video');
    }

    // Delete from DB
    await run('DELETE FROM apartment_videos WHERE id = ?', [videoId]);

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get agent's apartments
export const getAgentApartments = async (req, res) => {
  try {
    const apartments = await query(
      `SELECT a.*,
        (SELECT image_url FROM apartment_images WHERE apartment_id = a.id AND is_primary = 1 LIMIT 1) as primary_image,
        (SELECT COUNT(*) FROM apartment_images WHERE apartment_id = a.id) as image_count
       FROM apartments a
       WHERE a.agent_id = ?
       ORDER BY a.created_at DESC`,
      [req.user.id]
    );

    res.json(apartments);
  } catch (error) {
    console.error('Get agent apartments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};