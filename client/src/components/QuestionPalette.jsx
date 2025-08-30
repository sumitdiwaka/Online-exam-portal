// src/components/QuestionPalette.jsx
import React from 'react';

function QuestionPalette({ totalQuestions, userAnswers, currentQuestionIndex, onQuestionJump }) {
  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
      <h3 className="text-lg font-bold mb-4 text-white">Question Navigation</h3>
      <div className="grid grid-cols-5 gap-2">
        {/* Create an array from 0 to totalQuestions-1 to map over */}
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const isAttempted = userAnswers[index] !== undefined;
          const isCurrent = index === currentQuestionIndex;

          // Determine the button color based on its state
          let buttonClass = 'bg-gray-600 hover:bg-gray-500'; // Default: Not attempted
          if (isAttempted) {
            buttonClass = 'bg-green-600 hover:bg-green-500'; // Attempted
          }
          if (isCurrent) {
            buttonClass = 'bg-yellow-500 ring-2 ring-white'; // Current question
          }

          return (
            <button
              key={index}
              onClick={() => onQuestionJump(index)}
              className={`w-full h-10 flex items-center justify-center rounded text-white font-semibold transition-colors duration-200 ${buttonClass}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
      <div className="mt-4 text-sm text-gray-300">
        <p><span className="inline-block w-3 h-3 bg-green-600 rounded-full mr-2"></span> Answered</p>
        <p><span className="inline-block w-3 h-3 bg-gray-600 rounded-full mr-2"></span> Not Answered</p>
        <p><span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span> Current</p>
      </div>
    </div>
  );
}

export default QuestionPalette;