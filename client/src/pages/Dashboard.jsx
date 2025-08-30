import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestions, fetchResultsByEmail, deleteResultById } from '../api/examApi';

function Dashboard() {
  // CHANGED: State to hold both name and email for the initial form
  const [credentials, setCredentials] = useState({ name: '', email: '' });
  const [userResults, setUserResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [examConfig, setExamConfig] = useState({
    name: '',
    class: '9',
    subject: 'Math',
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    // CHANGED: Look for a 'userDetails' object in localStorage
    const savedUserDetails = localStorage.getItem('userDetails');
    if (savedUserDetails) {
      const user = JSON.parse(savedUserDetails);
      setCredentials(user);
      // NEW: Pre-fill the exam form's name field
      setExamConfig(prevConfig => ({ ...prevConfig, name: user.name }));
      handleFetchResults(null, user); 
    }
  }, []);

  const handleFetchResults = async (e, savedUser = null) => {
    if (e) e.preventDefault();
    const userToFetch = savedUser || credentials;

    // CHANGED: Check for both name and email
    if (!userToFetch.email || !userToFetch.name) {
      setError('Please enter your name and email.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const results = await fetchResultsByEmail(userToFetch.email);
      setUserResults(results);
      // CHANGED: Save the entire user details object
      localStorage.setItem('userDetails', JSON.stringify(userToFetch)); 
    } catch (err) {
      setError('Could not fetch results. Please check the email and try again.');
      setUserResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartExam = async (e) => {
    e.preventDefault();
    if (!examConfig.name) {
      setError('Please enter your name to start the exam.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const questions = await fetchQuestions(examConfig.class, examConfig.subject);
      if (questions.length === 0) {
        setError('No questions found for this combination. Please try another.');
        setIsLoading(false);
        return;
      }
      // CHANGED: Use the main credentials email
      navigate('/exam', { state: { questions, userDetails: { ...examConfig, email: credentials.email } } });
    } catch (err) {
      setError('Failed to fetch questions. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // CHANGED: Remove 'userDetails' item
    localStorage.removeItem('userDetails');
    setUserResults(null);
    setCredentials({ name: '', email: '' });
    setError('');
  };

  const handleDeleteResult = async (resultId) => {
    if (window.confirm('Are you sure you want to delete this result permanently?')) {
      try {
        await deleteResultById(resultId);
        setUserResults(prevResults => prevResults.filter(result => result._id !== resultId));
      } catch (err) {
        setError('Failed to delete the result. Please try again.');
      }
    }
  };
  
  // NEW: Handle changes in the initial credentials form
  const handleCredentialChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 flex flex-col items-center">
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Welcome to the Exam Portal</h1>
        <p className="text-lg text-blue-300 mt-2">Your gateway to knowledge assessment</p>
      </header>
      
      {userResults ? (
        <div className="w-full max-w-5xl">
          <div className="text-center mb-6">
            {/* CHANGED: Display the user's name instead of email */}
            <p className="text-xl text-gray-300">Welcome back, <span className="font-bold text-cyan-400">{credentials.name}</span>!</p>
            <button onClick={handleLogout} className="text-sm text-cyan-500 hover:underline mt-1">
              (Not you? Change user)
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Start New Exam Section */}
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl">
              <h2 className="text-3xl font-bold text-white mb-6">Start a New Exam</h2>
              <form onSubmit={handleStartExam} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                  <input
                    type="text" id="name" value={examConfig.name}
                    onChange={(e) => setExamConfig({ ...examConfig, name: e.target.value })}
                    className="w-full px-4 py-2 mt-1 text-white bg-black/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="class" className="block text-sm font-medium text-gray-300">Class</label>
                  <select
                    id="class" value={examConfig.class}
                    onChange={(e) => setExamConfig({ ...examConfig, class: e.target.value })}
                    className="w-full px-4 py-2 mt-1 text-white bg-black/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="9" className='text-blue-700'>Class 9</option>
                    <option value="10" className='text-blue-700'>Class 10</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300">Subject</label>
                  <select
                    id="subject" value={examConfig.subject}
                    onChange={(e) => setExamConfig({ ...examConfig, subject: e.target.value })}
                    className="w-full px-4 py-2 mt-1 text-white bg-black/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="Math" className='text-blue-700'>Math</option>
                    <option value="Science" className='text-blue-700'>Science</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 font-bold text-lg text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition-all duration-300 transform hover:scale-105 disabled:bg-cyan-800"
                >
                  {isLoading ? 'Loading...' : 'Begin Test'}
                </button>
              </form>
            </div>

            {/* Past Results Section */}
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl">
              <h2 className="text-3xl font-bold text-white mb-6">Your Past Results</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {userResults.length > 0 ? (
                  userResults.map((result) => (
                    <div key={result._id} className="bg-black/20 p-4 rounded-lg flex justify-between items-center border border-transparent hover:border-cyan-400 transition-colors group">
                      <div>
                        <p className="font-bold text-lg">{result.subject} - Class {result.class}</p>
                        <p className="text-sm text-gray-400">
                          Taken on: {new Date(result.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-2xl text-cyan-400">{result.score}/{result.totalQuestions}</p>
                          <p className="text-sm">({Math.round((result.score / result.totalQuestions) * 100)}%)</p>
                        </div>
                        <button
                          onClick={() => handleDeleteResult(result._id)}
                          className="p-2 bg-red-800/50 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-700 transition-all duration-300 transform hover:scale-110"
                          title="Delete Result"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 py-10">No past results found for this email.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Email Form (Initial View)
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Find Your Dashboard</h2>
          <form onSubmit={handleFetchResults} className="space-y-4">
            {/* NEW: Name input field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">Enter Your Name</label>
              <input
                type="text" id="name" name="name" value={credentials.name}
                onChange={handleCredentialChange}
                className="w-full px-4 py-2 mt-1 text-white bg-black/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Enter Your Email</label>
              <input
                type="email" id="email" name="email" value={credentials.email}
                onChange={handleCredentialChange}
                className="w-full px-4 py-2 mt-1 text-white bg-black/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="you@example.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 font-semibold text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 disabled:bg-cyan-800 transition-colors"
            >
              {isLoading ? 'Searching...' : 'Find My Results'}
            </button>
          </form>
        </div>
      )}
      
      {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
    </div>
  );
}

export default Dashboard;