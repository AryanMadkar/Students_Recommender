import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiChevronLeft, 
  FiStar, 
  FiMapPin, 
  FiGlobe, 
  FiUsers,
  FiAward,
  FiDollarSign,
  FiBookmark,
  FiShare2,
  FiExternalLink
} from "react-icons/fi";
import axios from "axios";

const CollegeDetails = () => {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    fetchCollegeDetails();
  }, [collegeId]);

  const fetchCollegeDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/colleges/${collegeId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setCollege(response.data.data);
        checkBookmarkStatus();
      }
    } catch (err) {
      setError('Failed to load college details');
      console.error('College fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/colleges/user/favorites`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const favorites = response.data.data.favorites || [];
      setIsBookmarked(favorites.some(fav => fav._id === collegeId));
    } catch (err) {
      console.error('Bookmark check error:', err);
    }
  };

  const toggleBookmark = async () => {
    try {
      const token = localStorage.getItem('token');
      const method = isBookmarked ? 'delete' : 'post';
      
      await axios[method](
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/colleges/${collegeId}/favorite`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error('Bookmark toggle error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'College not found'}</p>
          <button
            onClick={() => navigate('/colleges')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Colleges
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "courses", label: "Courses" },
    { id: "admissions", label: "Admissions" },
    { id: "placements", label: "Placements" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <FiChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleBookmark}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isBookmarked
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiBookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>{isBookmarked ? 'Saved' : 'Save'}</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                <FiShare2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* College Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-sm mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8">
            <div className="flex-shrink-0 mb-6 lg:mb-0">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {college.shortName || college.name.charAt(0)}
                </span>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {college.name}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <FiMapPin className="w-4 h-4" />
                      <span>{college.location?.city}, {college.location?.state}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{college.ratings?.overall || 'N/A'}/5</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {college.type}
                  </span>
                  {college.rankings && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Top Ranked
                    </span>
                  )}
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FiUsers className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-500">Students</div>
                  <div className="font-semibold">10,000+</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FiAward className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-500">Placement</div>
                  <div className="font-semibold">{college.placementStats?.placementPercentage || 85}%</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FiDollarSign className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-500">Avg Package</div>
                  <div className="font-semibold">
                    ₹{((college.placementStats?.averagePackage || 800000) / 100000).toFixed(1)}L
                  </div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FiGlobe className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-500">Courses</div>
                  <div className="font-semibold">{college.courses?.length || 0}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-sm"
            >
              {activeTab === "overview" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">About {college.name}</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {college.description || `${college.name} is one of the premier educational institutions in ${college.location?.state}, known for its academic excellence and outstanding placement record. The college offers a wide range of undergraduate and postgraduate programs designed to prepare students for successful careers in their chosen fields.`}
                  </p>
                  
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Highlights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <FiStar className="w-6 h-6 text-blue-600 mb-2" />
                      <h5 className="font-semibold text-gray-900 mb-1">Academic Excellence</h5>
                      <p className="text-sm text-gray-600">
                        Rated {college.ratings?.overall || 4.5}/5 for overall academic quality
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <FiAward className="w-6 h-6 text-green-600 mb-2" />
                      <h5 className="font-semibold text-gray-900 mb-1">Industry Recognition</h5>
                      <p className="text-sm text-gray-600">
                        Recognized by leading industry partners and accreditation bodies
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <FiUsers className="w-6 h-6 text-purple-600 mb-2" />
                      <h5 className="font-semibold text-gray-900 mb-1">Expert Faculty</h5>
                      <p className="text-sm text-gray-600">
                        Experienced faculty members with industry and research background
                      </p>
                    </div>
                    
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <FiGlobe className="w-6 h-6 text-orange-600 mb-2" />
                      <h5 className="font-semibold text-gray-900 mb-1">Modern Infrastructure</h5>
                      <p className="text-sm text-gray-600">
                        State-of-the-art facilities and well-equipped laboratories
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "courses" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Courses</h3>
                  <div className="space-y-4">
                    {college.courses?.map((course, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{course.name}</h4>
                            <p className="text-gray-600">Duration: {course.duration}</p>
                          </div>
                          <div className="mt-2 sm:mt-0 text-right">
                            <div className="text-lg font-bold text-gray-900">
                              ₹{((course.fees?.annual || 100000) / 1000).toFixed(0)}K/year
                            </div>
                            <div className="text-sm text-gray-500">Annual Fee</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-900">Eligibility: </span>
                            <span className="text-gray-600">
                              {course.eligibility?.stream?.join(', ') || 'Check requirements'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">Entrance: </span>
                            <span className="text-gray-600">{course.eligibility?.entranceExam || 'Merit based'}</span>
                          </div>
                        </div>

                        {course.cutoffs && course.cutoffs.length > 0 && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-900">Latest Cutoff: </span>
                            <span className="text-gray-600">
                              {course.cutoffs[0].cutoff}% ({course.cutoffs[0].category})
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "admissions" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Admission Process</h3>
                  <div className="space-y-6">
                    <div className="p-6 bg-blue-50 rounded-lg">
                      <h4 className="text-lg font-semibold text-blue-900 mb-4">Application Timeline</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-800">1</span>
                          </div>
                          <div>
                            <div className="font-medium text-blue-900">Application Opens</div>
                            <div className="text-sm text-blue-700">December - February</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-800">2</span>
                          </div>
                          <div>
                            <div className="font-medium text-blue-900">Entrance Exam</div>
                            <div className="text-sm text-blue-700">March - April</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-800">3</span>
                          </div>
                          <div>
                            <div className="font-medium text-blue-900">Results & Counselling</div>
                            <div className="text-sm text-blue-700">May - June</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-semibold text-gray-900 mb-2">Required Documents</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• 10th & 12th Mark Sheets</li>
                          <li>• Transfer Certificate</li>
                          <li>• Category Certificate (if applicable)</li>
                          <li>• Passport Size Photographs</li>
                          <li>• Entrance Exam Score Card</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-semibold text-gray-900 mb-2">Selection Criteria</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Entrance Exam Score (70%)</li>
                          <li>• 12th Grade Marks (20%)</li>
                          <li>• Personal Interview (10%)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "placements" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Placement Statistics</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {college.placementStats?.placementPercentage || 95}%
                      </div>
                      <div className="text-gray-600">Placement Rate</div>
                    </div>
                    
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        ₹{((college.placementStats?.averagePackage || 1200000) / 100000).toFixed(1)}L
                      </div>
                      <div className="text-gray-600">Average Package</div>
                    </div>
                    
                    <div className="text-center p-6 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        ₹{((college.placementStats?.highestPackage || 4500000) / 100000).toFixed(0)}L
                      </div>
                      <div className="text-gray-600">Highest Package</div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Top Recruiters</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(college.placementStats?.topRecruiters || ['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Wipro', 'IBM', 'Accenture']).map((recruiter, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg text-center">
                          <div className="font-medium text-gray-900">{recruiter}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-yellow-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-yellow-900 mb-2">Placement Support</h4>
                    <p className="text-yellow-800 mb-4">
                      Dedicated placement cell providing comprehensive career guidance and industry connections.
                    </p>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Resume building workshops</li>
                      <li>• Mock interview sessions</li>
                      <li>• Industry mentorship programs</li>
                      <li>• Skill development training</li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Apply */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
            >
              <h3 className="text-xl font-bold mb-2">Interested in this College?</h3>
              <p className="text-blue-100 mb-4 text-sm">
                Get personalized guidance and admission support
              </p>
              <button className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Get Admission Guidance
              </button>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Address</div>
                    <div className="text-sm text-gray-600">
                      {college.location?.address || `${college.location?.city}, ${college.location?.state}`}
                    </div>
                  </div>
                </div>
                
                {college.website && (
                  <div className="flex items-start space-x-3">
                    <FiGlobe className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Website</div>
                      <a
                        href={college.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                      >
                        <span>Visit Official Website</span>
                        <FiExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Similar Colleges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Similar Colleges</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900">IIT Delhi</div>
                  <div className="text-sm text-gray-600">New Delhi</div>
                </button>
                
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900">NIT Trichy</div>
                  <div className="text-sm text-gray-600">Tamil Nadu</div>
                </button>
                
                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900">BITS Pilani</div>
                  <div className="text-sm text-gray-600">Rajasthan</div>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetails;
