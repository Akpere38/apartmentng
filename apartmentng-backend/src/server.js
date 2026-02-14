import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apartmentRoutes from './routes/apartments.js';
import adminRoutes from './routes/admin.js';
import agentRoutes from './routes/agents.js';

// Load environment variables
dotenv.config();

// Create Express app (like creating React app)
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (like global wrappers in React)
// 1. CORS - allows frontend to talk to backend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// 2. Parse JSON bodies (like handling form data in React)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Routes (like React Router routes)
// Think of these as: "When someone visits /api/apartments, use apartmentRoutes"
app.use('/api/apartments', apartmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/agents', agentRoutes);

// Health check endpoint (to test if server is running)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Apartment NG API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: err.message 
  });
});

// Start server (like ReactDOM.render)
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});