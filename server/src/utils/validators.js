// Academic validation
const validateAcademicPercentage = (percentage) => {
  return percentage >= 0 && percentage <= 100;
};

// Phone number validation (Indian)
const validateIndianPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// Validate education stage transition
const validateStageTransition = (currentStage, newStage) => {
  const validTransitions = {
    'after10th': ['after12th', 'ongoing'],
    'after12th': ['ongoing'],
    'ongoing': []
  };
  
  return validTransitions[currentStage]?.includes(newStage) || false;
};

// Validate assessment response format
const validateAssessmentResponse = (question, response) => {
  switch (question.type) {
    case 'multiple_choice':
      return question.options.some(opt => opt.value === response);
    
    case 'rating':
      const rating = parseInt(response);
      return rating >= 1 && rating <= 5;
    
    case 'boolean':
      return typeof response === 'boolean';
    
    case 'text':
      return typeof response === 'string' && response.length <= 500;
    
    case 'ranking':
      return Array.isArray(response) && response.length === question.options.length;
    
    default:
      return false;
  }
};

// Validate college filter parameters
const validateCollegeFilters = (filters) => {
  const errors = [];
  
  if (filters.minRating && (filters.minRating < 0 || filters.minRating > 5)) {
    errors.push('Rating must be between 0 and 5');
  }
  
  if (filters.maxFees && filters.maxFees < 0) {
    errors.push('Max fees must be positive');
  }
  
  if (filters.page && filters.page < 1) {
    errors.push('Page must be positive');
  }
  
  if (filters.limit && (filters.limit < 1 || filters.limit > 100)) {
    errors.push('Limit must be between 1 and 100');
  }
  
  return errors;
};

// Validate skill level
const validateSkillLevel = (level) => {
  const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  return validLevels.includes(level);
};

// Validate date range
const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return start <= end && start >= new Date('1900-01-01');
};

// Validate MongoDB ObjectId
const validateObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

// Validate password strength
const validatePasswordStrength = (password) => {
  const checks = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  const passedChecks = Object.values(checks).filter(Boolean).length;
  
  return {
    isValid: passedChecks >= 4,
    strength: passedChecks < 3 ? 'Weak' : passedChecks < 4 ? 'Medium' : 'Strong',
    checks
  };
};

// Validate file type
const validateFileType = (filename, allowedTypes) => {
  const extension = filename.split('.').pop().toLowerCase();
  return allowedTypes.includes(extension);
};

// Validate Indian postal code
const validatePincode = (pincode) => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

module.exports = {
  validateAcademicPercentage,
  validateIndianPhone,
  validateStageTransition,
  validateAssessmentResponse,
  validateCollegeFilters,
  validateSkillLevel,
  validateDateRange,
  validateObjectId,
  validatePasswordStrength,
  validateFileType,
  validatePincode
};
