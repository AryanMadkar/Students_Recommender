const College = require("../models/College");
const User = require("../models/User");

class CollegeController {
  async searchColleges(req, res) {
    try {
      const { state, city, course, type, minRating, maxFees, page = 1, limit = 20, sortBy = "ratings.overall" } = req.query;
      const query = { isActive: true };
      if (state) query["location.state"] = new RegExp(state, "i");
      if (city) query["location.city"] = new RegExp(city, "i");
      if (type) query.type = type;
      if (minRating) query["ratings.overall"] = { $gte: parseFloat(minRating) };
      if (course) query["courses.name"] = new RegExp(course, "i");
      if (maxFees) query["courses.fees.annual"] = { $lte: parseInt(maxFees) };

      const colleges = await College.find(query).sort({ [sortBy]: -1 }).limit(limit * 1).skip((page - 1) * limit).lean();
      const total = await College.countDocuments(query);
      res.json({ success: true, data: { colleges, pagination: { currentPage: parseInt(page), totalPages: Math.ceil(total / limit), totalColleges: total } } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getCollegeDetails(req, res) {
    try {
      const { collegeId } = req.params;
      const college = await College.findById(collegeId);
      if (!college) return res.status(404).json({ success: false, message: "College not found" });
      res.json({ success: true, data: college });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async compareColleges(req, res) {
    try {
      const { collegeIds } = req.body;
      if (!collegeIds || collegeIds.length < 2) return res.status(400).json({ success: false, message: "Provide at least 2 college IDs" });
      const colleges = await College.find({ _id: { $in: collegeIds }, isActive: true }).lean();
      const comparison = {
        colleges: colleges.map((college) => ({
          id: college._id,
          name: college.name,
          location: college.location,
          type: college.type,
          ratings: college.ratings,
          placementStats: college.placementStats,
          fees: this.getAverageFees(college.courses),
        })),
        analysis: this.generateComparisonAnalysis(colleges),
      };
      res.json({ success: true, data: comparison });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getPersonalizedRecommendations(req, res) {
    try {
      const userId = req.user.id;
      const { course, budget, preferredState } = req.query;
      const query = { isActive: true };
      if (course) query["courses.name"] = new RegExp(course, "i");
      if (budget) query["courses.fees.annual"] = { $lte: parseInt(budget) };
      if (preferredState) query["location.state"] = preferredState;
      const colleges = await College.find(query).sort({ "ratings.overall": -1 }).limit(10).lean();
      const recommendations = colleges.map((college) => ({
        ...college,
        matchScore: this.calculateMatchScore(college, { course, budget, preferredState }),
        reasons: this.generateRecommendationReasons(college, { course, budget, preferredState }),
      }));
      res.json({ success: true, data: recommendations.sort((a, b) => b.matchScore - a.matchScore) });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async addToFavorites(req, res) {
    try {
      const { collegeId } = req.params;
      const userId = req.user.id;
      const college = await College.findById(collegeId);
      if (!college) return res.status(404).json({ success: false, message: "College not found" });
      const user = await User.findById(userId);
      if (!user.favorites) user.favorites = { colleges: [] };
      if (!user.favorites.colleges) user.favorites.colleges = [];
      if (user.favorites.colleges.includes(collegeId)) return res.status(400).json({ success: false, message: "College already in favorites" });
      user.favorites.colleges.push(collegeId);
      await user.save();
      res.json({ success: true, message: "College added to favorites", data: { collegeId, collegeName: college.name } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async removeFromFavorites(req, res) {
    try {
      const { collegeId } = req.params;
      const userId = req.user.id;
      const user = await User.findById(userId);
      if (!user.favorites || !user.favorites.colleges) return res.status(404).json({ success: false, message: "No favorites found" });
      const index = user.favorites.colleges.indexOf(collegeId);
      if (index === -1) return res.status(404).json({ success: false, message: "College not in favorites" });
      user.favorites.colleges.splice(index, 1);
      await user.save();
      res.json({ success: true, message: "College removed from favorites" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUserFavorites(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).populate("favorites.colleges");
      if (!user.favorites || !user.favorites.colleges) return res.json({ success: true, data: { favorites: [], count: 0 } });
      res.json({ success: true, data: { favorites: user.favorites.colleges, count: user.favorites.colleges.length } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Helpers
  getAverageFees(courses) {
    if (!courses || courses.length === 0) return 0;
    const total = courses.reduce((sum, course) => sum + (course.fees?.annual || 0), 0);
    return total / courses.length;
  }

  generateComparisonAnalysis(colleges) {
    return {
      bestRated: colleges.reduce((best, current) => (current.ratings.overall > best.ratings.overall ? current : best)).name,
      mostAffordable: colleges.reduce((affordable, current) => (this.getAverageFees(current.courses) < this.getAverageFees(affordable.courses) ? current : affordable)).name,
      bestPlacement: colleges.reduce((best, current) => (current.placementStats.averagePackage > best.placementStats.averagePackage ? current : best)).name,
    };
  }

  calculateMatchScore(college, preferences) {
    let score = 0;
    if (preferences.course && college.courses.some((c) => c.name.toLowerCase().includes(preferences.course.toLowerCase()))) score += 30;
    if (preferences.budget) {
      const avgFees = this.getAverageFees(college.courses);
      if (avgFees <= preferences.budget) score += 25;
    }
    if (preferences.preferredState && college.location.state === preferences.preferredState) score += 20;
    score += college.ratings.overall * 2.5;
    return Math.min(score, 100);
  }

  generateRecommendationReasons(college, preferences) {
    const reasons = [];
    if (college.ratings.overall >= 4) reasons.push("Highly rated institution");
    if (college.placementStats.placementPercentage >= 80) reasons.push("Excellent placement record");
    if (preferences.preferredState && college.location.state === preferences.preferredState) reasons.push("Located in your preferred state");
    return reasons;
  }
}

module.exports = new CollegeController();
