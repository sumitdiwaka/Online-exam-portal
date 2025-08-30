// src/pages/ResultPage.jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function ResultPage() {
  const location = useLocation();
  const { score, totalQuestions, questions, userAnswers } = location.state || {};

  if (typeof score === 'undefined') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl mb-4">No result to display.</h1>
        <Link to="/" className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Go to Home
        </Link>
      </div>
    );
  }

  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Exam Result</h1>
        <p className="text-lg text-gray-400 mb-6">Here's how you performed.</p>

        <div className="bg-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-blue-400">Your Score</h2>
          <p className="text-6xl font-bold my-4">
            {score} <span className="text-3xl text-gray-400">/ {totalQuestions}</span>
          </p>
          <p className="text-2xl font-semibold">{percentage}%</p>
        </div>

        <div className="text-left">
          <h3 className="text-xl font-bold mb-4">Review Your Answers</h3>
          {questions.map((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            return (
              <div key={question._id} className="mb-6 p-4 bg-gray-700 rounded-lg">
                <p className="font-semibold text-lg mb-2">{index + 1}. {question.questionText}</p>
                <p className={`p-2 rounded-md ${isCorrect ? 'bg-green-800' : 'bg-red-800'}`}>
                  Your answer: {userAnswer || "Not Answered"}
                </p>
                {!isCorrect && (
                  <p className="p-2 mt-2 rounded-md bg-green-800">
                    Correct answer: {question.correctAnswer}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <Link
          to="/"
          className="mt-8 inline-block px-8 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Take Another Exam
        </Link>
      </div>
    </div>
  );
}

export default ResultPage;