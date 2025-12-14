import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';
import { Quiz } from '../types';
import CategoryCard from '../components/CategoryCard';

const StudentDashboard: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [quizzesRes, categoriesRes] = await Promise.all([
        quizAPI.getAvailable(),
        quizAPI.getCategories()
      ]);
      setQuizzes(quizzesRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Failed to load data', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = selectedCategory
    ? quizzes.filter(q => q.category === selectedCategory)
    : quizzes;

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>👋 Welcome to Your Dashboard</h1>
          <p className="dashboard-subtitle">Choose a quiz and start learning today!</p>
        </div>
      </div>
      
      <section className="categories-section">
        <h2>📚 Browse by Category</h2>
        <div className="categories-grid">
          <div 
            className={`category-card ${!selectedCategory ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            <div className="category-icon">🌐</div>
            <h3>All Categories</h3>
            <p className="category-count">{quizzes.length} quizzes</p>
          </div>
          {categories.map(cat => (
            <div
              key={cat}
              className={`category-card ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              <div className="category-icon">📚</div>
              <h3>{cat}</h3>
              <p className="category-count">{quizzes.filter(q => q.category === cat).length} quizzes</p>
            </div>
          ))}
        </div>
      </section>

      <section className="quizzes-section">
        <h2>✨ {selectedCategory || 'All'} Quizzes</h2>
        {filteredQuizzes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💭</div>
            <p>No quizzes available in this category</p>
          </div>
        ) : (
          <div className="quizzes-grid">
            {filteredQuizzes.map(quiz => (
              <div key={quiz._id} className="quiz-card" onClick={() => navigate(`/quiz/${quiz._id}`)}>
                <div className="quiz-card-header">
                  <span className="category-badge">{quiz.category}</span>
                  <span className="quiz-icon">📝</span>
                </div>
                <h3>{quiz.title}</h3>
                <div className="quiz-meta">
                  <span className="meta-item">⏱️ {Math.floor(quiz.timeLimitSeconds / 60)} min</span>
                </div>
                <button className="quiz-start-btn">Start Quiz →</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentDashboard;
