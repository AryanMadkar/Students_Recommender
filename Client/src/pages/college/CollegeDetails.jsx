import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronLeft, FiStar, FiMapPin, FiGlobe, FiUsers, FiAward, FiDollarSign, FiBookmark, FiShare2, FiExternalLink, FiTrendingUp } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import {Link} from "react-router-dom";
const CollegeDetails = () => {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, api } = useAuth();
  const [college, setCollege] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchCollegeDetails();
  }, [collegeId, isAuthenticated]);

  const fetchCollegeDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/colleges/${collegeId}`);
      if (response.data.success) {
        setCollege(response.data.data);
        checkBookmarkStatus();
      }
    } catch (err) {
      setError("Failed to load college details");
      console.error("College fetch error:", err);
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const response = await api.get("/api/colleges/user/favorites");
      const favorites = response.data.data.favorites || [];
      setIsBookmarked(favorites.some((fav) => fav._id === collegeId));
    } catch (err) {
      console.error("Bookmark check error:", err);
    }
  };

  const toggleBookmark = async () => {
    try {
      const method = isBookmarked ? "delete" : "post";
      await api[method](`/api/colleges/${collegeId}/favorite`);
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error("Bookmark toggle error:", err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading college details...</div>;
  }

  if (error || !college) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-600">{error || "College not found"}</p>
        <Link to="/colleges" className="text-blue-600">Back to Search</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 mb-4">
        <FiChevronLeft className="mr-2" /> Back
      </button>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">{college.name}</h1>
            <p className="text-gray-600 flex items-center mt-2">
              <FiMapPin className="mr-2" /> {college.location?.city}, {college.location?.state}
            </p>
          </div>
          <div className="flex space-x-4">
            <button onClick={toggleBookmark} className="text-2xl">
              <FiBookmark className={isBookmarked ? "text-blue-600" : "text-gray-400"} />
            </button>
            <button className="text-2xl text-gray-600"><FiShare2 /></button>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button onClick={() => setActiveTab("overview")} className={`px-4 py-2 ${activeTab === "overview" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Overview</button>
          <button onClick={() => setActiveTab("courses")} className={`px-4 py-2 ${activeTab === "courses" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Courses</button>
          <button onClick={() => setActiveTab("placements")} className={`px-4 py-2 ${activeTab === "placements" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Placements</button>
        </div>

        {activeTab === "overview" && (
          <div>
            <p className="mb-6">{college.description || `${college.name} is one of the premier educational institutions in ${college.location?.state}, known for its academic excellence and outstanding placement record. The college offers a wide range of undergraduate and postgraduate programs designed to prepare students for successful careers in their chosen fields.`}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 rounded">
                <FiStar className="text-yellow-500" /> Rated {college.ratings?.overall || 4.5}/5 for overall academic quality
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <FiAward className="text-blue-500" /> Recognized by leading industry partners and accreditation bodies
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <FiUsers className="text-green-500" /> Experienced faculty members with industry and research background
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <FiGlobe className="text-purple-500" /> State-of-the-art facilities and well-equipped laboratories
              </div>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="space-y-4">
            {college.courses?.map((course, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded">
                <h3 className="font-semibold">{course.name}</h3>
                <p className="flex items-center"><FiGlobe className="mr-2" /> Duration: {course.duration}</p>
                <p className="flex items-center"><FiDollarSign className="mr-2" /> Fees: ₹{course.fees?.annual?.toLocaleString()}</p>
              </div>
            )) || <p>No courses listed.</p>}
          </div>
        )}

        {activeTab === "placements" && (
          <div>
            <p className="mb-4">Dedicated placement cell providing comprehensive career guidance and industry connections.</p>
            <div className="p-4 bg-gray-100 rounded">
              <FiTrendingUp className="text-green-500" /> Average Package: ₹{college.placementStats?.averagePackage?.toLocaleString() || "15,00,000"}
            </div>
            <div className="p-4 bg-gray-100 rounded mt-4">
              <FiUsers className="text-blue-500" /> Top Recruiters: {college.placementStats?.topRecruiters?.join(", ") || "Google, Microsoft, Amazon"}
            </div>
          </div>
        )}
      </motion.div>

      <Link to="/counseling" className="block mt-6 text-center text-blue-600 hover:text-blue-800">
        Get personalized guidance and admission support
      </Link>
    </div>
  );
};

export default CollegeDetails;
