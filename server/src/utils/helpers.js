const crypto = require('crypto');

// Generate random string
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Calculate age from date of birth
const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Format percentage
const formatPercentage = (value, decimals = 1) => {
  return `${parseFloat(value).toFixed(decimals)}%`;
};

// Calculate similarity between two arrays
const calculateArraySimilarity = (arr1, arr2) => {
  const intersection = arr1.filter(x => arr2.includes(x));
  const union = [...new Set([...arr1, ...arr2])];
  return intersection.length / union.length;
};

// Normalize text for comparison
const normalizeText = (text) => {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// Calculate weighted average
const calculateWeightedAverage = (values, weights) => {
  if (values.length !== weights.length) {
    throw new Error('Values and weights arrays must have the same length');
  }
  
  const weightedSum = values.reduce((sum, value, index) => sum + (value * weights[index]), 0);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  return weightedSum / totalWeight;
};

// Paginate array
const paginate = (array, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  return {
    data: array.slice(startIndex, endIndex),
    currentPage: page,
    totalPages: Math.ceil(array.length / limit),
    totalItems: array.length,
    hasNext: endIndex < array.length,
    hasPrev: startIndex > 0
  };
};

// Deep merge objects
const deepMerge = (target, source) => {
  const result = { ...target };
  for (const key in source) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
};

// Format Indian currency
const formatIndianCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

// Convert to title case
const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// Generate slug from text
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Check if email is valid
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate OTP
const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// FIXED: Complete sanitize HTML function
const sanitizeHtml = (html) => {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/<iframe\b[^>]*>/gi, '')
    .replace(/<object\b[^>]*>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<form\b[^>]*>/gi, '')
    .replace(/<input\b[^>]*>/gi, '')
    .replace(/<textarea\b[^>]*>/gi, '')
    .replace(/<select\b[^>]*>/gi, '')
    .trim();
};

// Validate Indian Aadhaar number
const validateAadhaar = (aadhaar) => {
  const aadhaarRegex = /^[2-9]{1}[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}$/;
  return aadhaarRegex.test(aadhaar.replace(/\s/g, ''));
};

// Generate random password
const generateRandomPassword = (length = 12) => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  let password = '';
  
  // Ensure at least one character from each category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

module.exports = {
  generateRandomString,
  calculateAge,
  formatPercentage,
  calculateArraySimilarity,
  normalizeText,
  calculateWeightedAverage,
  paginate,
  deepMerge,
  formatIndianCurrency,
  toTitleCase,
  generateSlug,
  isValidEmail,
  generateOTP,
  formatFileSize,
  sanitizeHtml,
  validateAadhaar,
  generateRandomPassword
};
