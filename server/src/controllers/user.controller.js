const User = require('../models/User');

class UserController {
  // Get user profile
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updateData = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, select: '-password' }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get user dashboard data
  async getDashboard(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const dashboardData = {
        user: {
          name: user.personalInfo?.name || 'User',
          stage: user.educationStage,
          profileCompletion: user.progress?.profileCompletion || 0
        },
        stats: {
          assessmentsCompleted: user.progress?.assessmentsCompleted || 0,
          recommendationsGenerated: user.recommendations?.length || 0,
          profileCompletion: user.progress?.profileCompletion || 0
        },
        nextSteps: ['Complete your profile', 'Take assessments', 'Get recommendations']
      };

      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Upload avatar - ADD THIS METHOD
  async uploadAvatar(req, res) {
    try {
      const userId = req.user.id;
      
      // Mock avatar upload for now
      res.json({
        success: true,
        message: 'Avatar uploaded successfully',
        data: {
          avatarUrl: 'https://via.placeholder.com/150'
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Delete user account - ADD THIS METHOD
  async deleteAccount(req, res) {
    try {
      const userId = req.user.id;
      
      await User.findByIdAndDelete(userId);

      res.json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get user preferences - ADD THIS METHOD
  async getPreferences(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select('preferences');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const preferences = user.preferences || {
        notifications: true,
        emailUpdates: true,
        theme: 'light'
      };

      res.json({
        success: true,
        data: preferences
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update user preferences - ADD THIS METHOD
  async updatePreferences(req, res) {
    try {
      const userId = req.user.id;
      const preferences = req.body;

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { preferences } },
        { new: true }
      ).select('preferences');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'Preferences updated successfully',
        data: user.preferences
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

// IMPORTANT: Make sure to export properly
module.exports = new UserController();
