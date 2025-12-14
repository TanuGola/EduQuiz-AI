import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ResultSummaryProps {
  correct: number;
  wrong: number;
  score: number;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ correct, wrong, score }) => {
  const data = {
    labels: ['Correct', 'Wrong'],
    datasets: [{
      data: [correct, wrong],
      backgroundColor: ['#4CAF50', '#f44336'],
    }]
  };

  return (
    <div className="result-summary">
      <h2>Quiz Results</h2>
      <div className="score-display">
        <div className="score-circle">{score}%</div>
      </div>
      <div className="stats">
        <div className="stat">
          <span className="stat-label">Correct:</span>
          <span className="stat-value correct">{correct}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Wrong:</span>
          <span className="stat-value wrong">{wrong}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{correct + wrong}</span>
        </div>
      </div>
      <div className="chart-container">
        <Pie data={data} />
      </div>
    </div>
  );
};

export default ResultSummary;
