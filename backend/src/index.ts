import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { uploadsDir } from './middleware/upload.js';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import debugRoutes from './routes/debugRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// __dirname removed (not used) to satisfy TypeScript no-unused-vars rules
const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL || 'http://localhost:5173',
].filter(Boolean);

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.some((allowedOrigin) => {
      const normalizedAllowed = allowedOrigin.replace(/\/$/, '');
      const normalizedOrigin = origin.replace(/\/$/, '');
      return normalizedAllowed === normalizedOrigin;
    })) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (serve uploaded images from the upload middleware directory)
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/categories', categoryRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/reports', reportRoutes);
app.use('/debug', debugRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'OK' });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
