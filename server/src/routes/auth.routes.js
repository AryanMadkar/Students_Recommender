const express = require("express");
const authController = require("../controllers/auth.controller");
const {
  validateRegistration,
  validateLogin,
  validatePasswordReset,
  handleValidationErrors,
} = require("../middleware/validation.middleware");
const { authLimiter } = require("../middleware/rateLimit.middleware");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Public routes
router.post(
  "/register",
  authLimiter,
  validateRegistration,
  handleValidationErrors,
  authController.register
);

router.post(
  "/login",
  authLimiter,
  validateLogin,
  handleValidationErrors,
  authController.login
);

router.post("/forgot-password", authLimiter, authController.forgotPassword);

router.post(
  "/reset-password",
  authLimiter,
  validatePasswordReset,
  handleValidationErrors,
  authController.resetPassword
);

// Protected routes
router.get("/me", authMiddleware, authController.getCurrentUser);
router.get("/validate", authMiddleware, authController.validateToken); // Added missing route
router.post("/logout", authMiddleware, (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
