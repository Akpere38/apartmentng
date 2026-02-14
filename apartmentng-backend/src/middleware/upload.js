import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
// This temporarily stores files before uploading to Cloudinary
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Temporary storage
  },
  filename: (req, file, cb) => {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter - only allow images and videos
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedVideoTypes = /mp4|mov|avi|wmv/;
  
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;
  
  if (file.fieldname === 'images') {
    // Check if image
    if (allowedImageTypes.test(extname) && mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for images field'));
    }
  } else if (file.fieldname === 'videos') {
    // Check if video
    if (allowedVideoTypes.test(extname) && mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed for videos field'));
    }
  } else {
    cb(new Error('Unexpected field'));
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: fileFilter
});

export default upload;