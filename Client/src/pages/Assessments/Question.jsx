import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const QuizQuestion = ({ 
  questionData, 
  currentQuestion, 
  totalQuestions, 
  onNext, 
  onPrevious, 
  onAnswerSelect 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleAnswerSelect = (optionId) => {
    setSelectedAnswer(optionId);
    onAnswerSelect(optionId);
  };

  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-100"
      >
        <div className="flex items-center justify-between p-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FiChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            {questionData.subject} Assessment
          </h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      </motion.div>

      {/* Progress and Question Counter */}
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-900">
              Question {currentQuestion}/{totalQuestions}
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
              {questionData.difficulty || 'Medium'}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-blue-600 h-2 rounded-full"
            />
          </div>
        </motion.div>

        {/* Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6"
        >
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {questionData.question}
          </h2>

          {/* Answer Options */}
          <div className="space-y-3">
            {questionData.options.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (index * 0.1) }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedAnswer === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleAnswerSelect(option.id)}
              >
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedAnswer === option.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedAnswer === option.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-white"
                    />
                  )}
                </div>
                <span className="text-gray-900 font-medium">{option.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-between"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPrevious}
            disabled={currentQuestion === 1}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              currentQuestion === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FiChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            disabled={!selectedAnswer}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              selectedAnswer
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>{currentQuestion === totalQuestions ? 'Submit' : 'Next'}</span>
            {currentQuestion !== totalQuestions && <FiChevronRight className="w-4 h-4" />}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizQuestion;
