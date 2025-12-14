import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ResultSummary from '../components/ResultSummary';
import { quizAPI } from '../services/api';

const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="result-page">
        <h2>No result data found</h2>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="result-page">
      <ResultSummary
        correct={result.correct}
        wrong={result.wrong}
        score={result.score}
      />
      <div className="result-actions">
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        <button onClick={() => navigate('/history')}>View History</button>
      </div>
    </div>
  );
};

export default ResultPage;
