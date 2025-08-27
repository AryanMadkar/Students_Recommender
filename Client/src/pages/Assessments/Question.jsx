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
import axios from "axios";

const QuizQuestion = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
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
    startAssessment();
  }, [assessmentId]);

  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestion]);

  const startAssessment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000"
        }/api/assessments/${assessmentId}/start`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
      const token = localStorage.getItem("token");
      const totalTime = Math.floor((Date.now() - startTime) / 1000);

      const submitData = {
        responses,
        timeSpent: {
          ...timeSpent,
          total: totalTime,
        },
      };

      const response = await axios.post(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000"
        }/api/assessments/${assessmentId}/submit`,
        submitData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiX className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 text-lg mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No questions available</p>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const hasAnswer = responses[currentQuestionData._id] !== undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate("/assessments")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <FiChevronLeft className="w-5 h-5" />
              <span>Exit Assessment</span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <FiClock className="w-4 h-4" />
                <span className="text-sm">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl p-8 shadow-sm mb-8"
        >
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {currentQuestionData.category?.charAt(0).toUpperCase() +
                  currentQuestionData.category?.slice(1)}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {currentQuestionData.difficulty?.charAt(0).toUpperCase() +
                  currentQuestionData.difficulty?.slice(1)}
              </span>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
              {currentQuestionData.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-4">
            {currentQuestionData.type === "multiple_choice" &&
              currentQuestionData.options?.map((option, index) => (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleAnswerSelect(option.value)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    responses[currentQuestionData._id] === option.value
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        responses[currentQuestionData._id] === option.value
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {responses[currentQuestionData._id] === option.value && (
                        <FiCheck className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="flex-1">{option.text}</span>
                  </div>
                </motion.button>
              ))}

            {currentQuestionData.type === "rating" && (
              <div className="flex items-center justify-center space-x-4">
                <span className="text-sm text-gray-500">Strongly Disagree</span>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleAnswerSelect(rating)}
                      className={`w-12 h-12 rounded-full border-2 font-medium transition-all ${
                        responses[currentQuestionData._id] === rating
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-gray-500">Strongly Agree</span>
              </div>
            )}

            {currentQuestionData.type === "boolean" && (
              <div className="flex space-x-4 justify-center">
                {[
                  { value: true, text: "Yes" },
                  { value: false, text: "No" },
                ].map((option) => (
                  <button
                    key={option.value.toString()}
                    onClick={() => handleAnswerSelect(option.value)}
                    className={`px-8 py-4 rounded-xl font-medium transition-all ${
                      responses[currentQuestionData._id] === option.value
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

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
            <FiChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={submitting || !hasAnswer}
              className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-colors ${
                submitting || !hasAnswer
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  <span>Submit Assessment</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!hasAnswer}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                !hasAnswer
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <span>Next</span>
              <FiChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Question Counter */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentQuestion
                    ? "bg-blue-500"
                    : responses[questions[index]._id] !== undefined
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;
