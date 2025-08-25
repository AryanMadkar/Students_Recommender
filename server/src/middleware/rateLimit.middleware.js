const rateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');

// General API rate limiting
const apiLimiter = rateLimit({
  store: new MongoStore({
    uri: process.env.MONGODB_URI,
    collectionName: 'rate_limits',
    expireTimeMs: 15 * 60 * 1000 // 15 minutes
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Authentication rate limiting (stricter)
const authLimiter = rateLimit({
  store: new MongoStore({
    uri: process.env.MONGODB_URI,
    collectionName: 'auth_rate_limits',
    expireTimeMs: 15 * 60 * 1000
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Assessment submission rate limiting
const assessmentLimiter = rateLimit({
  store: new MongoStore({
    uri: process.env.MONGODB_URI,
    collectionName: 'assessment_rate_limits',
    expireTimeMs: 60 * 60 * 1000 // 1 hour
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit to 10 assessment submissions per hour
  message: {
    success: false,
    message: 'Assessment submission limit reached. Please wait before submitting another assessment.'
  }
});

// AI service rate limiting (for expensive operations)
const aiLimiter = rateLimit({
  store: new MongoStore({
    uri: process.env.MONGODB_URI,
    collectionName: 'ai_rate_limits',
    expireTimeMs: 60 * 60 * 1000 // 1 hour
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit to 20 AI requests per hour
  message: {
    success: false,
    message: 'AI service limit reached. Please try again later.'
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  assessmentLimiter,
  aiLimiter
};
