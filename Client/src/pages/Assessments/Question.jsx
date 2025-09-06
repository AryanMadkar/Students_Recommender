import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const QuizQuestion = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, api } = useAuth();

  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [timeSpent, setTimeSpent] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [startTime, setStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    startAssessment();
  }, [assessmentId, isAuthenticated]);

  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestion]);

  const startAssessment = async () => {
    try {
      const response = await api.get(`/api/assessments/${assessmentId}/start`);

      if (response.data.success) {
        const data = response.data.data;
        setAssessment(data.assessment);
        setQuestions(data.questions);
        setStartTime(Date.now());
        setQuestionStartTime(Date.now());
      }
    } catch (err) {
      console.error("Assessment start error:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || "Assessment already completed");
        setTimeout(() => navigate("/assessments"), 3000);
      } else {
        setError("Failed to start assessment");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    // Record time spent on this question
    const timeOnQuestion = Math.floor((Date.now() - questionStartTime) / 1000);
    const questionId = questions[currentQuestion]._id;

    setTimeSpent((prev) => ({
      ...prev,
      [questionId]: timeOnQuestion,
    }));

    setResponses((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;

    setSubmitting(true);
    try {
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      const submitData = {
        responses,
        timeSpent: {
          ...timeSpent,
          total: totalTime,
        },
      };

      const response = await api.post(
        `/api/assessments/${assessmentId}/submit`,
        submitData
      );

      if (response.data.success) {
        navigate(`/assessments/${assessmentId}/results`, {
          state: { result: response.data.data.result },
        });
      }
    } catch (err) {
      console.error("Assessment submit error:", err);
      setError("Failed to submit assessment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestionContent = (question) => {
    const questionId = question._id;
    const currentResponse = responses[questionId];

    switch (question.type) {
      case "multiple_choice":
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option.value)}
                className={`w-full p-4 text-left border rounded-lg transition-colors ${
                  currentResponse === option.value
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      currentResponse === option.value
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {currentResponse === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                  <span>{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        );

      case "rating":
        return (
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleAnswerSelect(rating)}
                className={`w-12 h-12 rounded-full border-2 font-medium transition-colors ${
                  currentResponse === rating
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        );

      case "boolean":
        return (
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleAnswerSelect(true)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg border-2 font-medium transition-colors ${
                currentResponse === true
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <FiCheck className="w-5 h-5" />
              <span>Yes</span>
            </button>
            <button
              onClick={() => handleAnswerSelect(false)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg border-2 font-medium transition-colors ${
                currentResponse === false
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <FiX className="w-5 h-5" />
              <span>No</span>
            </button>
          </div>
        );

      case "text":
        return (
          <textarea
            value={currentResponse || ""}
            onChange={(e) => handleAnswerSelect(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Type your answer here..."
          />
        );

      default:
        return <p className="text-gray-500">Unsupported question type</p>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/assessments")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No questions available</p>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/assessments")}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {assessment?.title}
              </h1>
              <p className="text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FiClock className="w-4 h-4" />
            <span>Take your time</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQuestionData.text}
          </h2>
          {renderQuestionContent(currentQuestionData)}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              currentQuestion === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FiChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting || !responses[currentQuestionData._id]}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <span>{submitting ? "Submitting..." : "Submit Assessment"}</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!responses[currentQuestionData._id]}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <span>Next</span>
              <FiChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;
