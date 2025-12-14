import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherAPI } from '../services/api';
import { Quiz, Question } from '../types';

const TeacherDashboard: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [quizzesRes, questionsRes] = await Promise.all([
        teacherAPI.getQuizzes(),
        teacherAPI.getQuestions()
      ]);
      setQuizzes(quizzesRes.data);
      setQuestions(questionsRes.data);
    } catch (error) {
      console.error('Failed to load data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>🏛️ Teacher Dashboard</h1>
          <p className="dashboard-subtitle">Manage your quizzes and questions</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <button className="action-btn upload-btn" onClick={() => navigate('/teacher/upload')}>
          <span className="btn-icon">📤</span>
          <span>Upload Document</span>
        </button>
        <button className="action-btn create-btn" onClick={() => navigate('/teacher/create-quiz')}>
          <span className="btn-icon">➕</span>
          <span>Create Quiz</span>
        </button>
        <button className="action-btn manage-btn" onClick={() => navigate('/teacher/questions')}>
          <span className="btn-icon">📝</span>
          <span>Manage Questions</span>
        </button>
        <button className="action-btn leaderboard-btn" onClick={() => navigate('/leaderboard')}>
          <span className="btn-icon">🏆</span>
          <span>Leaderboard</span>
        </button>
      </div>

      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Total Questions</h3>
            <p className="stat-number">{questions.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>Total Quizzes</h3>
            <p className="stat-number">{quizzes.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Published</h3>
            <p className="stat-number">{quizzes.filter(q => q.published).length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <h3>Drafts</h3>
            <p className="stat-number">{quizzes.filter(q => !q.published).length}</p>
          </div>
        </div>
      </section>

      <section className="quizzes-section">
        <h2>📚 Your Quizzes</h2>
        {quizzes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💭</div>
            <p>No quizzes created yet. Start by uploading a document!</p>
          </div>
        ) : (
          <div className="quizzes-list">
            {quizzes.map(quiz => (
              <div key={quiz._id} className="quiz-item">
                <div className="quiz-item-header">
                  <h3>{quiz.title}</h3>
                  <span className={`status-badge ${quiz.published ? 'published' : 'draft'}`}>
                    {quiz.published ? '✅ Published' : '📄 Draft'}
                  </span>
                </div>
                <div className="quiz-item-details">
                  <span className="detail-item">📚 {quiz.category}</span>
                  <span className="detail-item">📝 {quiz.questionIds?.length || 0} questions</span>
                </div>
                <button className="edit-btn" onClick={() => navigate(`/teacher/quiz/${quiz._id}`)}>Edit Quiz</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TeacherDashboard;
