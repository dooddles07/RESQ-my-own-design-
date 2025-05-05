import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRouter from './routers/authRouter.js';
import sosRouter from './routers/sosRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 8081;

// CORS options
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:8081',  // The URL of your React Native app during development
      'http://192.168.100.134:8081', // If accessing from a mobile device on the same network
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));  // Apply CORS middleware with your configuration

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/sos', sosRouter);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
