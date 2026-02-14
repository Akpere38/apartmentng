import jwt from 'jsonwebtoken';

// Middleware to verify JWT token
// Think of this like a "protected route" wrapper in React
export const verifyToken = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next(); // Continue to next middleware/route
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};

// Middleware to check if user is agent
export const isAgent = (req, res, next) => {
  if (req.user.role !== 'agent') {
    return res.status(403).json({ error: 'Access denied. Agent only.' });
  }
  next();
};

// Middleware to check if user is either admin or agent
export const isAdminOrAgent = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'agent') {
    return res.status(403).json({ error: 'Access denied.' });
  }
  next();
};