import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, getDBStatus } from './config/db.js';
import contactRoutes from './routes/contactRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

// Resolve directory to ensure backend/.env is loaded regardless of root or backend execution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Trust reverse proxy (Nginx on EC2)
app.set('trust proxy', 1);

// 1. Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Prevents interfering with client-side SPA assets
    crossOriginEmbedderPolicy: false,
  })
);

// 2. CORS configuration
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        process.env.NODE_ENV === 'development'
      ) {
        callback(null, true);
      } else {
        callback(new Error('CORS request blocked by Havenly Security Policy.'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. HTTP Request Logging with Morgan
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// 4. Request Body Parsers
app.use(express.json({ limit: '15kb' }));
app.use(express.urlencoded({ extended: true, limit: '15kb' }));

// 5. Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.',
  },
});
app.use('/api/', generalLimiter);

const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Form submission limit reached. Please wait a few moments before sending another message.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please wait 15 minutes before trying again.',
  },
});

// 6. Root & Health Check Endpoints
app.get('/', (req, res) => {
  const dbStatus = getDBStatus();
  res.json({
    name: 'Havenly Interiors REST API',
    tagline: 'Sculpting Transcendent Architectural Spaces',
    version: '1.0.0',
    documentation: {
      health: 'GET /api/health',
      inquiries: 'POST /api/contact, GET /api/contact (admin)',
      bookings: 'POST /api/bookings, GET /api/bookings (admin)',
      adminAuth: 'POST /api/admin/login',
      adminStats: 'GET /api/admin/stats (admin)',
    },
    localization: {
      currency: 'NPR (Rs.)',
      phoneCode: '+977',
      timeZone: 'Asia/Kathmandu (NPT)',
    },
    databaseConnected: dbStatus.isConnected,
  });
});

app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  const statusCode = dbStatus.isConnected ? 200 : 503;

  res.status(statusCode).json({
    success: dbStatus.isConnected,
    message: dbStatus.isConnected
      ? 'Havenly Interiors backend and database are fully operational.'
      : 'Havenly Interiors backend is active, but MongoDB is not connected.',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      connected: dbStatus.isConnected,
      host: dbStatus.host,
      dbName: dbStatus.name,
      readyState: dbStatus.readyState,
    },
    environment: process.env.NODE_ENV || 'development',
  });
});

// 7. API Routes
app.use('/api/contact', submissionLimiter, contactRoutes);
app.use('/api/bookings', submissionLimiter, bookingRoutes);
app.use('/api/admin/login', authLimiter);
app.use('/api/admin', adminRoutes);

// 8. 404 & Global Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// 9. Server Initialization
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  // Attempt MongoDB connection
  await connectDB();

  // Explicitly listen on '0.0.0.0' for universal IPv4 and IPv6 loopback reachability
  app.listen(PORT, '0.0.0.0', () => {
    console.log('\n============================================================');
    console.log(`🏛️  Havenly Interiors API running at: http://localhost:${PORT}`);
    console.log(`   Direct API URL: http://127.0.0.1:${PORT}`);
    console.log(`   Health Check:   http://localhost:${PORT}/api/health`);
    console.log(`   Environment:    ${process.env.NODE_ENV || 'development'}`);
    console.log('============================================================\n');
  });
};

// Start the server
startServer();

export default app;
