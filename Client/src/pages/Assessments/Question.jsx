import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiClock, FiCheck, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";

const QuizQuestion = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, api } = useAuth();
  const { submitAssessment } = useApp();
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
    const timeOnQuestion = Math.floor((Date.now() - questionStartTime) / 1000);
    const questionId = questions[currentQuestion]._id;
    setTimeSpent((prev) => ({ ...prev, [questionId]: timeOnQuestion }));
    setResponses((prev) => ({ ...prev, [questionId]: answer }));
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
        timeSpent: { ...timeSpent, total: totalTime },
      };
      const result = await submitAssessment(assessmentId, submitData);
      navigate(`/assessments/${assessmentId}/results`, { state: { result: result.result } });
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
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option.value)}
                className={`w-full p-4 rounded-lg border ${
                  currentResponse === option.value ? "bg-blue-100 border-blue-600" : "border-gray-300"
                } hover:bg-blue-50`}
              >
                {option.text}
              </button>
            ))}
          </div>
        );
      case "rating":
        return (
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((rate) => (
              <button
                key={rate}
                onClick={() => handleAnswerSelect(rate)}
                className={`px-4 py-2 rounded ${
                  currentResponse === rate ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                {rate}
              </button>
            ))}
          </div>
        );
      case "boolean":
        return (
          <div className="flex space-x-4">
            <button
              onClick={() => handleAnswerSelect(true)}
              className={`flex-1 p-4 rounded-lg ${
                currentResponse === true ? "bg-green-100 border-green-600" : "border-gray-300"
              }`}
            >
              <FiCheck className="inline mr-2" /> Yes
            </button>
            <button
              onClick={() => handleAnswerSelect(false)}
              className={`flex-1 p-4 rounded-lg ${
                currentResponse === false ? "bg-red-100 border-red-600" : "border-gray-300"
              }`}
            >
              <FiX className="inline mr-2" /> No
            </button>
          </div>
        );
      case "text":
        return (
          <input
            type="text"
            value={currentResponse || ""}
            onChange={(e) => handleAnswerSelect(e.target.value)}
            className="w-full p-4 border rounded-lg"
            placeholder="Enter your response"
          />
        );
      default:
        return <p>Unsupported question type</p>;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading assessment...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center mt-8">{error}</div>;
  }

  if (!assessment || questions.length === 0) {
    return <div className="text-center mt-8">No questions available.</div>;
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{assessment.title}</h1>
          <div className="flex items-center">
            <FiClock className="mr-2" /> {Math.floor((Date.now() - startTime) / 1000)}s
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-xl mb-6">{questions[currentQuestion].question}</p>
        {renderQuestionContent(questions[currentQuestion])}
        <div className="flex justify-between mt-8">
          <button onClick={handlePrevious} disabled={currentQuestion === 0} className="flex items-center px-4 py-2 bg-gray-200 rounded disabled:opacity-50">
            <FiChevronLeft className="mr-2" /> Previous
          </button>
          {currentQuestion < questions.length - 1 ? (
            <button onClick={handleNext} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded">
              Next <FiChevronRight className="ml-2" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} className="flex items-center px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50">
              {submitting ? "Submitting..." : "Submit"} <FiCheck className="ml-2" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuizQuestion;
