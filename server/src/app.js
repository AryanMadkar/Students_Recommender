// app.js - FIXED CORS configuration
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Import routes
const authRoutes = require('./routes/auth.routes');
const assessmentRoutes = require('./routes/assessment.routes');
const recommendationRoutes = require('./routes/recommendation.routes');
const userRoutes = require('./routes/user.routes');
const collegeRoutes = require('./routes/college.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

// Import middleware
const { errorHandler, notFound } = require('./middleware/error.middleware');
const logger = require('./utils/logger');

const app = express();

// Security middleware
app.use(helmet());

// FIXED: Single CORS configuration with proper origin list
app.use(cors({
  origin: [
    "http://localhost:5173", // Vite React
    "http://localhost:3000", // optional extra if you test on CRA
    "http://localhost:3001"
  ],
  credentials: true,  // allow cookies / auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks

// Compression middleware
app.use(compression());

// HTTP logging
app.use(morgan('combined', { stream: logger.stream }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'PathPilot API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/dashboard', dashboardRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'PathPilot API v1.0.0',
    documentation: `${req.protocol}://${req.get('host')}/docs`,
    endpoints: {
      auth: '/api/auth',
      assessments: '/api/assessments',
      recommendations: '/api/recommendations',
      users: '/api/users',
      colleges: '/api/colleges',
      dashboard: '/api/dashboard'
    }
  });
});

// Handle 404 errors
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;
