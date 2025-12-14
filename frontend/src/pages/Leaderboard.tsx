import React, { useEffect, useState } from 'react';
import { userAPI, quizAPI } from '../services/api';
import { LeaderboardEntry } from '../types';
import LeaderboardTable from '../components/LeaderboardTable';

const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const response = await quizAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories', error);
    }
  };

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getLeaderboard(selectedCategory);
      setEntries(response.data);
    } catch (error) {
      console.error('Failed to load leaderboard', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leaderboard-page">
      <div className="page-header">
        <h1>🏆 Leaderboard</h1>
        <p className="page-subtitle">See how you rank against other learners</p>
      </div>
      
      <div className="filter-section">
        <label>📊 Filter by Category:</label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : entries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💭</div>
          <p>No leaderboard data available yet</p>
        </div>
      ) : (
        <div className="table-container">
          <LeaderboardTable entries={entries} />
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
