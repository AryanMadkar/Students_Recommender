const rateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');

// Create separate store instances for each rate limiter
const createMongoStore = (collectionName) => {
  if (!process.env.MONGODB_URI) {
    return undefined; // Use default memory store
  }
  
  try {
    return new MongoStore({
      uri: process.env.MONGODB_URI,
      collectionName: collectionName,
      expireTimeMs: 15 * 60 * 1000 // 15 minutes
    });
  } catch (error) {
    console.warn(`Failed to create ${collectionName} store, using memory store:`, error.message);
    return undefined; // Use default memory store
  }
};

// General API rate limiting
const apiLimiter = rateLimit({
  store: createMongoStore('api_rate_limits'),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Disable validation to prevent double count error
  validate: {
    singleCount: false // Disable double count validation
  }
});

// Authentication rate limiting (stricter)
const authLimiter = rateLimit({
  store: createMongoStore('auth_rate_limits'),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    singleCount: false // Disable double count validation
  }
});

// Assessment submission rate limiting
const assessmentLimiter = rateLimit({
  store: createMongoStore('assessment_rate_limits'),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit to 10 assessment submissions per hour
  message: {
    success: false,
    message: 'Assessment submission limit reached. Please wait before submitting another assessment.'
  },
  validate: {
    singleCount: false // Disable double count validation
  }
});

// AI service rate limiting (for expensive operations)
const aiLimiter = rateLimit({
  store: createMongoStore('ai_rate_limits'),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit to 20 AI requests per hour
  message: {
    success: false,
    message: 'AI service limit reached. Please try again later.'
  },
  validate: {
    singleCount: false // Disable double count validation
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  assessmentLimiter,
  aiLimiter
};



// const rateLimit = require('express-rate-limit');

// // General API rate limiting
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   message: {
//     success: false,
//     message: 'Too many requests from this IP, please try again later.'
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

// // Authentication rate limiting (stricter)
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5,
//   message: {
//     success: false,
//     message: 'Too many authentication attempts, please try again later.'
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

// // Assessment submission rate limiting
// const assessmentLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 10,
//   message: {
//     success: false,
//     message: 'Assessment submission limit reached. Please wait before submitting another assessment.'
//   }
// });

// // AI service rate limiting
// const aiLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 20,
//   message: {
//     success: false,
//     message: 'AI service limit reached. Please try again later.'
//   }
// });

// module.exports = {
//   apiLimiter,
//   authLimiter,
//   assessmentLimiter,
//   aiLimiter
// };
