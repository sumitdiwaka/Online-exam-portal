// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import ExamSetup from './pages/Dashboard';
import ExamPage from './pages/ExamPage';
import ResultPage from './pages/ResultPage'; // Import

function App() {
  return (
    <div className="bg-slate-900 min-h-screen text-white">
      <Routes>
        <Route path="/" element={<ExamSetup />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/result" element={<ResultPage />} /> {/* Add Route */}
      </Routes>
    </div>
  );
}

export default App;