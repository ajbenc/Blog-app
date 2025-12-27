import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import tumblrRoutes from './routes/tumblrRoutes.js';

dotenv.config();

const app = express();

// CORS Configuration for Development and Production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://blogmaster-ajbenc.vercel.app'
];

// In production, you can also use environment variable
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    console.log('Request from origin:', origin); // Debug log
    
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Origin not allowed:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Handle preflight requests for all routes
app.options('*', cors());

app.use(express.json());

// Connect to database first
await connectDB();

// Add before your routes
const DEBUG = process.env.NODE_ENV !== 'production';
if (DEBUG) {
  app.use((req, res, next) => {
    console.log(`Route requested: ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Mount routes - order is important
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/tumblr', tumblrRoutes);
app.use('/uploads', express.static('uploads'));

// Test route
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
