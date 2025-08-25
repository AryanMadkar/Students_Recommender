const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const emailService = require('../services/email.service');

class AuthController {
  // Register new user
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { name, email, password, phone, educationStage } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ 'personalInfo.email': email });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'User already exists with this email' 
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = new User({
        personalInfo: { name, email, phone },
        password: hashedPassword,
        educationStage
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Send welcome email
      await emailService.sendWelcomeEmail(user.personalInfo.email, user.personalInfo.name);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          token,
          user: {
            id: user._id,
            name: user.personalInfo.name,
            email: user.personalInfo.email,
            educationStage: user.educationStage
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ 'personalInfo.email': email });
      if (!user) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Update last active
      user.progress.lastActive = new Date();
      await user.save();

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user._id,
            name: user.personalInfo.name,
            email: user.personalInfo.email,
            educationStage: user.educationStage,
            profileCompletion: user.progress.profileCompletion
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Forgot password
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      
      const user = await User.findOne({ 'personalInfo.email': email });
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found with this email' 
        });
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET + user.password,
        { expiresIn: '1h' }
      );

      // Send reset email
      await emailService.sendPasswordResetEmail(email, resetToken);

      res.json({
        success: true,
        message: 'Password reset email sent successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Reset password
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      
      // Verify token (this is simplified - in production, store tokens in DB)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid or expired token' 
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      user.password = hashedPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password reset successful'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Invalid or expired token' });
    }
  }

  // Get current user
  async getCurrentUser(req, res) {
    try {
      const user = await User.findById(req.user.id)
        .select('-password')
        .populate('assessmentResults.assessmentId');

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AuthController();
