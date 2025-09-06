import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiStar, FiMapPin, FiBookmark, FiArrowRight, FiFilter, FiTrendingUp, FiAward, FiChevronLeft } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const RecommendedColleges = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ budget: "", location: "" });
  const { isAuthenticated, api } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchRecommendations();
  }, [isAuthenticated, filters]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/colleges/recommendations/personalized", { params: filters });
      if (response.data.success) {
        setRecommendations(response.data.data || []);
      }
    } catch (err) {
      console.error("Recommendations fetch error:", err);
      if (err.response?.status === 401) navigate("/login");
      else setError("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return "text-green-600 bg-green-50";
    if (percentage >= 60) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const toggleSaveCollege = async (collegeId) => {
    try {
      await api.post(`/api/colleges/${collegeId}/favorite`);
      fetchRecommendations(); // Refresh to reflect change
    } catch (err) {
      console.error("Toggle save error:", err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading recommendations...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Recommended Colleges</h1>
      <p className="mb-4">Colleges that match your profile and career goals</p>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="flex space-x-4 mb-6">
        <input placeholder="Budget (e.g., 200000)" value={filters.budget} onChange={(e) => setFilters({ ...filters, budget: e.target.value })} className="p-2 border" />
        <input placeholder="Location (e.g., Maharashtra)" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} className="p-2 border" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((college) => (
          <motion.div key={college._id} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold">{college.name}</h2>
            <p className="flex items-center"><FiMapPin className="mr-2" /> {college.location?.city}, {college.location?.state}</p>
            <p className="flex items-center"><FiStar className="mr-2 text-yellow-500" /> {college.ratings?.overall || 4.5}/5</p>
            <p className="flex items-center"><FiDollarSign className="mr-2" /> Starting from ₹{college.fees?.annual ? (college.fees.annual / 100000).toFixed(1) : "2.5"}L/year</p>
            <p className={`mt-2 px-2 py-1 rounded ${getMatchColor(college.matchScore)}`}>{college.matchScore}% Match</p>
            <p>{college.description || "Excellent institution known for its academic excellence and outstanding placement record."}</p>
            <div className="flex justify-between mt-4">
              <button onClick={() => toggleSaveCollege(college._id)}><FiBookmark /></button>
              <Link to={`/colleges/${college._id}`} className="flex items-center text-blue-600">
                View Details <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      <Link to="/assessments" className="block mt-6 text-center">Complete your profile and take assessments to get personalized college recommendations</Link>
      <Link to="/counseling" className="block mt-4 text-center text-blue-600">Get personalized counseling and application support for your preferred colleges</Link>
    </div>
  );
};

export default RecommendedColleges;
