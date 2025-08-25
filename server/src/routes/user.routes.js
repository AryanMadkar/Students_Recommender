const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateProfileUpdate, handleValidationErrors } = require('../middleware/validation.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get user profile
router.get('/profile', userController.getProfile);

// Update user profile
router.put('/profile', 
  validateProfileUpdate,
  handleValidationErrors,
  userController.updateProfile
);

// Get dashboard data
router.get('/dashboard', userController.getDashboard);

// Upload profile picture
router.post('/upload-avatar', userController.uploadAvatar);

// Delete user account
router.delete('/account', userController.deleteAccount);

// Get user preferences
router.get('/preferences', userController.getPreferences);

// Update user preferences
router.put('/preferences', userController.updatePreferences);

module.exports = router;
