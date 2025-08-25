const User = require('../models/User');
const Assessment = require('../models/Assessment');
const Recommendation = require('../models/Recommendation');
const Result = require('../models/Result');

class DashboardController {
  // Get comprehensive dashboard data
  async getDashboardData(req, res) {
    try {
      const userId = req.user.id;
      
      const [user, recentResults, recommendations] = await Promise.all([
        User.findById(userId).populate('assessmentResults.assessmentId'),
        Result.find({ userId }).sort({ completedAt: -1 }).limit(5).populate('assessmentId'),
        Recommendation.find({ userId }).sort({ createdAt: -1 }).limit(5)
      ]);

      const dashboardData = {
        overview: {
          profileCompletion: user.progress.profileCompletion,
          assessmentsCompleted: user.progress.assessmentsCompleted,
          stage: user.educationStage,
          lastActive: user.progress.lastActive
        },
        
        stats: await this.getUserStats(userId),
        recentActivity: await this.getRecentActivity(userId),
        quickActions: this.getQuickActions(user),
        recommendations: recommendations.slice(0, 3),
        progress: await this.getProgressData(userId)
      };

      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get user statistics
  async getUserStats(userId) {
    const [assessmentCount, recommendationCount, user] = await Promise.all([
      Result.countDocuments({ userId }),
      Recommendation.countDocuments({ userId }),
      User.findById(userId)
    ]);

    return {
      assessmentsCompleted: assessmentCount,
      recommendationsGenerated: recommendationCount,
      profileCompletion: user.progress.profileCompletion,
      accountAge: Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24)) // days
    };
  }

  // Get recent user activity
  async getRecentActivity(userId) {
    const activities = [];
    
    // Recent assessments
    const recentResults = await Result.find({ userId })
      .sort({ completedAt: -1 })
      .limit(3)
      .populate('assessmentId');

    recentResults.forEach(result => {
      activities.push({
        type: 'assessment_completed',
        title: `Completed ${result.assessmentId.title}`,
        date: result.completedAt,
        score: result.scores.overall
      });
    });

    // Recent recommendations
    const recentRecommendations = await Recommendation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(2);

    recentRecommendations.forEach(rec => {
      activities.push({
        type: 'recommendation_generated',
        title: `New ${rec.type} recommendations`,
        date: rec.createdAt,
        count: rec.recommendations.length
      });
    });

    return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Get quick actions based on user stage and progress
  getQuickActions(user) {
    const actions = [];
    
    // Profile completion
    if (user.progress.profileCompletion < 100) {
      actions.push({
        title: 'Complete Profile',
        description: 'Finish setting up your profile for better recommendations',
        action: 'complete_profile',
        priority: 'high'
      });
    }
    
    // Assessment completion
    if (user.progress.assessmentsCompleted === 0) {
      actions.push({
        title: 'Take First Assessment',
        description: 'Start with an aptitude test to get personalized recommendations',
        action: 'start_assessment',
        priority: 'high'
      });
    }
    
    // Stage-specific actions
    switch (user.educationStage) {
      case 'after10th':
        actions.push({
          title: 'Explore Streams',
          description: 'Discover which stream suits you best',
          action: 'explore_streams',
          priority: 'medium'
        });
        break;
        
      case 'after12th':
        actions.push({
          title: 'Find Colleges',
          description: 'Search and compare colleges for your preferred courses',
          action: 'search_colleges',
          priority: 'medium'
        });
        break;
        
      case 'ongoing':
        actions.push({
          title: 'Skill Roadmap',
          description: 'Get a personalized skill development plan',
          action: 'create_roadmap',
          priority: 'medium'
        });
        break;
    }
    
    return actions.slice(0, 4); // Return top 4 actions
  }

  // Get progress tracking data
  async getProgressData(userId) {
    const user = await User.findById(userId);
    const results = await Result.find({ userId }).sort({ completedAt: 1 });
    
    // Calculate progress over time
    const progressPoints = results.map((result, index) => ({
      assessment: index + 1,
      overallScore: result.scores.overall,
      date: result.completedAt,
      skills: {
        analytical: result.scores.analytical,
        creative: result.scores.creative,
        technical: result.scores.technical,
        communication: result.scores.communication,
        leadership: result.scores.leadership
      }
    }));

    return {
      milestones: this.getMilestones(user),
      skillProgress: progressPoints,
      nextGoals: this.getNextGoals(user),
      achievements: this.getUserAchievements(user, results)
    };
  }

  // Get user milestones
  getMilestones(user) {
    const milestones = [
      { title: 'Profile Created', completed: true, date: user.createdAt },
      { title: 'Profile Completed', completed: user.progress.profileCompletion === 100 },
      { title: 'First Assessment', completed: user.progress.assessmentsCompleted > 0 },
      { title: 'Recommendations Generated', completed: user.recommendations.length > 0 }
    ];

    return milestones;
  }

  // Get next goals for user
  getNextGoals(user) {
    const goals = [];
    
    if (user.progress.assessmentsCompleted < 3) {
      goals.push('Complete 3 comprehensive assessments');
    }
    
    if (user.recommendations.length === 0) {
      goals.push('Generate first set of recommendations');
    }
    
    goals.push('Explore 5 recommended colleges/courses');
    goals.push('Create action plan for next 6 months');
    
    return goals;
  }

  // Get user achievements
  getUserAchievements(user, results) {
    const achievements = [];
    
    if (user.progress.profileCompletion === 100) {
      achievements.push({ title: 'Profile Master', icon: '🏆' });
    }
    
    if (results.length >= 5) {
      achievements.push({ title: 'Assessment Expert', icon: '🎯' });
    }
    
    if (results.some(r => r.scores.overall >= 90)) {
      achievements.push({ title: 'High Achiever', icon: '⭐' });
    }
    
    return achievements;
  }

  // Get analytics data for admin/user insights
  async getAnalytics(req, res) {
    try {
      const userId = req.user.id;
      
      const analytics = {
        assessmentPerformance: await this.getAssessmentAnalytics(userId),
        skillTrends: await this.getSkillTrends(userId),
        recommendationEffectiveness: await this.getRecommendationAnalytics(userId),
        timeSpentAnalysis: await this.getTimeAnalytics(userId)
      };

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAssessmentAnalytics(userId) {
    const results = await Result.find({ userId }).sort({ completedAt: 1 });
    
    return {
      totalAssessments: results.length,
      averageScore: results.reduce((sum, r) => sum + r.scores.overall, 0) / results.length,
      improvement: this.calculateImprovement(results),
      categoryStrengths: this.calculateCategoryStrengths(results)
    };
  }

  async getSkillTrends(userId) {
    const results = await Result.find({ userId }).sort({ completedAt: 1 });
    
    return results.map(result => ({
      date: result.completedAt,
      skills: result.scores
    }));
  }

  calculateImprovement(results) {
    if (results.length < 2) return 0;
    
    const first = results[0].scores.overall;
    const latest = results[results.length - 1].scores.overall;
    
    return ((latest - first) / first) * 100;
  }

  calculateCategoryStrengths(results) {
    if (results.length === 0) return {};
    
    const latestResult = results[results.length - 1];
    const scores = latestResult.scores;
    
    return Object.keys(scores)
      .filter(key => key !== 'overall')
      .sort((a, b) => scores[b] - scores[a])
      .reduce((strengths, skill) => {
        strengths[skill] = scores[skill];
        return strengths;
      }, {});
  }
}

module.exports = new DashboardController();
