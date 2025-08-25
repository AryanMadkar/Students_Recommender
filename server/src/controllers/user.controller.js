const User = require('../models/User');

class UserController {
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

      // Calculate profile completion
      const completion = this.calculateProfileCompletion(user);
      user.progress.profileCompletion = completion;
      await user.save();

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
      const user = await User.findById(userId)
        .populate('assessmentResults.assessmentId')
        .populate('recommendations');

      const dashboardData = {
        user: {
          name: user.personalInfo.name,
          stage: user.educationStage,
          profileCompletion: user.progress.profileCompletion
        },
        stats: {
          assessmentsCompleted: user.progress.assessmentsCompleted,
          recommendationsGenerated: user.recommendations.length,
          profileCompletion: user.progress.profileCompletion
        },
        recentAssessments: user.assessmentResults.slice(-3),
        latestRecommendations: user.recommendations.slice(-5),
        nextSteps: await this.getNextSteps(user)
      };

      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Calculate profile completion percentage
  calculateProfileCompletion(user) {
    let completion = 0;
    const checks = [
      user.personalInfo.name,
      user.personalInfo.email,
      user.personalInfo.phone,
      user.educationStage,
      user.personalInfo.state,
      user.personalInfo.city
    ];

    // Stage-specific checks
    if (user.educationStage === 'after10th') {
      checks.push(
        user.academicInfo.class10?.percentage,
        user.academicInfo.class10?.board
      );
    } else if (user.educationStage === 'after12th') {
      checks.push(
        user.academicInfo.class12?.stream,
        user.academicInfo.class12?.percentage,
        user.academicInfo.class10?.percentage
      );
    } else if (user.educationStage === 'ongoing') {
      checks.push(
        user.academicInfo.currentCourse?.degree,
        user.academicInfo.currentCourse?.specialization,
        user.academicInfo.currentCourse?.year
      );
    }

    const filled = checks.filter(item => item && item !== '').length;
    return Math.round((filled / checks.length) * 100);
  }

  // Get next steps for user
  async getNextSteps(user) {
    const steps = [];
    
    if (user.progress.profileCompletion < 100) {
      steps.push('Complete your profile setup');
    }
    
    if (user.progress.assessmentsCompleted === 0) {
      steps.push('Take your first assessment');
    }
    
    if (user.recommendations.length === 0) {
      steps.push('Get personalized recommendations');
    }

    return steps;
  }

  // Delete user account
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
}

module.exports = new UserController();
