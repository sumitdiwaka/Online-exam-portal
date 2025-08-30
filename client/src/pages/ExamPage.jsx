// src/pages/ExamPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitResult } from '../api/examApi';
import QuestionPalette from '../components/QuestionPalette';

function ExamPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [session, setSession] = useState(() => {
    const savedSession = localStorage.getItem('examSession');
    return savedSession ? JSON.parse(savedSession) : null;
  });
  
  // THE FIX IS HERE: Initialize timeLeft to null instead of 0
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    // If a session exists (from localStorage or a new one is being created)
    if (session) {
      const remaining = Math.floor((session.endTime - Date.now()) / 1000);
      setTimeLeft(remaining > 0 ? remaining : 0);
    } 
    // This part handles starting a brand new exam if no session exists
    else if (location.state?.questions) {
      const newSession = {
        questions: location.state.questions,
        userDetails: location.state.userDetails,
        userAnswers: {},
        currentQuestionIndex: 0,
        startTime: Date.now(),
        endTime: Date.now() + 1 * 60 * 1000,
      };
      setSession(newSession);
      localStorage.setItem('examSession', JSON.stringify(newSession));
      setTimeLeft(1 * 60);
    }
  }, [location.state, session?.startTime]); // Depend on session.startTime to ensure it only runs once for a restored session

  const handleSubmit = useCallback(async () => {
    if (!session) return;
    
    let score = 0;
    session.questions.forEach((question, index) => {
      if (question.correctAnswer === session.userAnswers[index]) { score += 1; }
    });

    const resultData = {
      userName: session.userDetails.name,
      email: session.userDetails.email,
      score: score,
      totalQuestions: session.questions.length,
      subject: session.userDetails.subject,
      class: session.userDetails.class,
    };

    try {
      await submitResult(resultData);
      localStorage.removeItem('examSession');
      navigate('/result', {
        state: {
          score: score,
          totalQuestions: session.questions.length,
          questions: session.questions,
          userAnswers: session.userAnswers,
        },
      });
    } catch (error) {
      alert('There was an error submitting your results.');
    }
  }, [session, navigate]);
  
  // Timer effect
  useEffect(() => {
    // UPDATED CHECK: Only submit when time is EXACTLY 0, not on the initial null state.
    if (timeLeft === 0 && session) {
      handleSubmit();
      return;
    }
    
    // Do not start the interval if timeLeft hasn't been set yet
    if (timeLeft === null) return;

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [timeLeft, session, handleSubmit]);

  const updateSession = (newSessionData) => {
    const updatedSession = { ...session, ...newSessionData };
    setSession(updatedSession);
    localStorage.setItem('examSession', JSON.stringify(updatedSession));
  };
  
  const handleAnswerSelect = (option) => {
    const newUserAnswers = { ...session.userAnswers, [session.currentQuestionIndex]: option };
    updateSession({ userAnswers: newUserAnswers });
  };
  
  const handleNext = () => {
    if (session.currentQuestionIndex < session.questions.length - 1) {
      updateSession({ currentQuestionIndex: session.currentQuestionIndex + 1 });
    }
  };

  const handlePrevious = () => {
    if (session.currentQuestionIndex > 0) {
      updateSession({ currentQuestionIndex: session.currentQuestionIndex - 1 });
    }
  };
  
  const handleQuestionJump = (index) => {
    if (index >= 0 && index < session.questions.length) {
      updateSession({ currentQuestionIndex: index });
    }
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl">Loading exam session...</p>
        <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-blue-600 rounded-md">If you are stuck, go to Dashboard</button>
      </div>
    );
  }

  const { questions, userDetails, userAnswers, currentQuestionIndex } = session;
  const currentQuestion = questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold">{userDetails.subject} Exam - Class {userDetails.class}</h1>
              <div className="text-2xl font-mono bg-red-600 px-4 py-2 rounded-md">
                {/* Show loading dots if timer is not ready yet */}
                {timeLeft === null ? '...' : (
                  <>
                    <span>{String(minutes).padStart(2, '0')}</span>:
                    <span>{String(seconds).padStart(2, '0')}</span>
                  </>
                )}
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Question {currentQuestionIndex + 1} of {questions.length}</h2>
              <p className="text-gray-300 text-xl">{currentQuestion.questionText}</p>
            </div>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div key={index} onClick={() => handleAnswerSelect(option)} className={`block w-full p-4 rounded-lg cursor-pointer transition-colors duration-200 ${userAnswers[currentQuestionIndex] === option ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
                  {option}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-8">
              <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="px-6 py-2 font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed">Previous</button>
              <button onClick={handleSubmit} className="px-6 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Submit Exam</button>
              <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1} className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed">Next</button>
            </div>
          </div>
        </div>
        <div className="md:col-span-1">
          <QuestionPalette totalQuestions={questions.length} userAnswers={userAnswers} currentQuestionIndex={currentQuestionIndex} onQuestionJump={handleQuestionJump} />
        </div>
      </div>
    </div>
  );
}

export default ExamPage;