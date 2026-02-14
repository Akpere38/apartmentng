import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

// Upload image to Cloudinary
export const uploadImage = async (filePath, folder = 'apartment-ng/apartments') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' }, // Limit max size
        { quality: 'auto' }, // Auto optimize quality
        { fetch_format: 'auto' } // Auto format (WebP for supported browsers)
      ]
    });
    
    // Delete temporary file
    fs.unlinkSync(filePath);
    
    return {
      url: result.secure_url,
      cloudinary_id: result.public_id
    };
  } catch (error) {
    // Delete temporary file even if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

// Upload video to Cloudinary
export const uploadVideo = async (filePath, folder = 'apartment-ng/videos') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'video',
      transformation: [
        { quality: 'auto' }
      ]
    });
    
    // Delete temporary file
    fs.unlinkSync(filePath);
    
    return {
      url: result.secure_url,
      cloudinary_id: result.public_id
    };
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

// Delete file from Cloudinary
export const deleteFile = async (cloudinaryId, resourceType = 'image') => {
  try {
    await cloudinary.uploader.destroy(cloudinaryId, {
      resource_type: resourceType
    });
    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
};