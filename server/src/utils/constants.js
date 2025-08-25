// Application constants
const APP_CONSTANTS = {
  APP_NAME: 'PathPilot',
  VERSION: '1.0.0',
  API_VERSION: 'v1',
  
  // Education stages
  EDUCATION_STAGES: {
    AFTER_10TH: 'after10th',
    AFTER_12TH: 'after12th',
    ONGOING: 'ongoing'
  },
  
  // Assessment types
  ASSESSMENT_TYPES: {
    APTITUDE: 'aptitude',
    INTEREST: 'interest',
    IQ: 'iq',
    PERSONALITY: 'personality',
    SUBJECT_PREFERENCE: 'subject_preference'
  },
  
  // Question types
  QUESTION_TYPES: {
    MULTIPLE_CHOICE: 'multiple_choice',
    RATING: 'rating',
    RANKING: 'ranking',
    TEXT: 'text',
    BOOLEAN: 'boolean'
  },
  
  // Streams for after 10th
  STREAMS: {
    SCIENCE: 'Science',
    COMMERCE: 'Commerce',
    ARTS: 'Arts'
  },
  
  // College types
  COLLEGE_TYPES: {
    GOVERNMENT: 'Government',
    PRIVATE: 'Private',
    DEEMED: 'Deemed',
    CENTRAL: 'Central'
  },
  
  // Course types
  COURSE_TYPES: {
    BACHELOR: 'Bachelor',
    MASTER: 'Master',
    DIPLOMA: 'Diploma',
    CERTIFICATE: 'Certificate',
    PHD: 'PhD'
  },
  
  // Recommendation types
  RECOMMENDATION_TYPES: {
    CAREER: 'career',
    COLLEGE: 'college',
    COURSE: 'course',
    SKILL: 'skill',
    ROADMAP: 'roadmap'
  },
  
  // Score categories
  SCORE_CATEGORIES: {
    ANALYTICAL: 'analytical',
    CREATIVE: 'creative',
    TECHNICAL: 'technical',
    COMMUNICATION: 'communication',
    LEADERSHIP: 'leadership'
  },
  
  // Indian states
  INDIAN_STATES: [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ],
  
  // Major entrance exams
  ENTRANCE_EXAMS: [
    'JEE Main', 'JEE Advanced', 'NEET', 'BITSAT', 'VITEEE', 'SRMJEEE',
    'COMEDK', 'KCET', 'MHT CET', 'WBJEE', 'TS EAMCET', 'AP EAMCET',
    'CAT', 'XAT', 'SNAP', 'NMAT', 'MAT', 'CMAT', 'ATMA',
    'CLAT', 'AILET', 'LSAT', 'DU LLB', 'BHU LLB',
    'NIFT', 'NID', 'CEED', 'SEED', 'UCEED'
  ],
  
  // Career categories
  CAREER_CATEGORIES: [
    'Engineering', 'Medical', 'Business', 'Arts', 'Science', 'Law',
    'Design', 'Media', 'Education', 'Government', 'Sports', 'Other'
  ],
  
  // Skill levels
  SKILL_LEVELS: {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
    EXPERT: 'Expert'
  },
  
  // File upload limits
  FILE_LIMITS: {
    AVATAR_SIZE: 5 * 1024 * 1024, // 5MB
    DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'gif'],
    ALLOWED_DOCUMENT_TYPES: ['pdf', 'doc', 'docx']
  },
  
  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
  },
  
  // Cache durations (in seconds)
  CACHE_DURATION: {
    SHORT: 300, // 5 minutes
    MEDIUM: 1800, // 30 minutes
    LONG: 3600, // 1 hour
    VERY_LONG: 86400 // 24 hours
  },
  
  // Email types
  EMAIL_TYPES: {
    WELCOME: 'welcome',
    PASSWORD_RESET: 'password_reset',
    ASSESSMENT_COMPLETE: 'assessment_complete',
    RECOMMENDATION: 'recommendation',
    REMINDER: 'reminder'
  },
  
  // Response messages
  MESSAGES: {
    SUCCESS: {
      REGISTRATION: 'User registered successfully',
      LOGIN: 'Login successful',
      PROFILE_UPDATED: 'Profile updated successfully',
      ASSESSMENT_SUBMITTED: 'Assessment submitted successfully',
      RECOMMENDATIONS_GENERATED: 'Recommendations generated successfully'
    },
    ERROR: {
      USER_EXISTS: 'User already exists with this email',
      INVALID_CREDENTIALS: 'Invalid email or password',
      USER_NOT_FOUND: 'User not found',
      UNAUTHORIZED: 'Unauthorized access',
      VALIDATION_FAILED: 'Validation failed',
      SERVER_ERROR: 'Internal server error',
      RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.'
    }
  }
};

module.exports = APP_CONSTANTS;
