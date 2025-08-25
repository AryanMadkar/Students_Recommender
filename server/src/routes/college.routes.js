const express = require('express');
const collegeController = require('../controllers/college.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateCollegeSearch, handleValidationErrors } = require('../middleware/validation.middleware');

const router = express.Router();

// Public routes
router.get('/search', 
  validateCollegeSearch,
  handleValidationErrors,
  collegeController.searchColleges
);

router.get('/:collegeId', collegeController.getCollegeDetails);

// Protected routes
router.use(authMiddleware);

router.post('/compare', collegeController.compareColleges);
router.get('/recommendations/personalized', collegeController.getPersonalizedRecommendations);
router.post('/:collegeId/favorite', collegeController.addToFavorites);
router.delete('/:collegeId/favorite', collegeController.removeFromFavorites);
router.get('/user/favorites', collegeController.getUserFavorites);

module.exports = router;
