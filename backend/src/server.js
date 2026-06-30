import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './database/connection.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Global Middleware
app.use(helmet());
app.use(morgan('dev'));

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
import { authRoutes } from './modules/authentication/index.js';
app.use('/api/auth', authRoutes);

// Base health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Research Connect API is healthy',
    data: {
      uptime: process.uptime(),
      timestamp: new Date(),
    },
    error: null,
  });
});

// Global 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.originalUrl}`,
    error: {
      code: 'NOT_FOUND',
      details: 'The requested resource could not be located on this server.',
    },
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;
