import React, { useEffect, useState } from 'react';
import { userAPI } from '../services/api';
import { HistoryItem } from '../types';

const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await userAPI.getHistory();
      setHistory(response.data);
    } catch (error) {
      console.error('Failed to load history', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="history-page">
      <div className="page-header">
        <h1>📊 Quiz History</h1>
        <p className="page-subtitle">Track your learning progress over time</p>
      </div>
      {history.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💭</div>
          <p>No quiz attempts yet. Start taking quizzes to see your history!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="history-table">
          <thead>
            <tr>
              <th>Quiz</th>
              <th>Category</th>
              <th>Date</th>
              <th>Score</th>
              <th>Correct</th>
              <th>Wrong</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index}>
                <td>{item.quizId?.title || 'N/A'}</td>
                <td>{item.quizId?.category || 'N/A'}</td>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td className="score">{item.score}%</td>
                <td className="correct">{item.correct}</td>
                <td className="wrong">{item.wrong}</td>
                <td>{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default History;
