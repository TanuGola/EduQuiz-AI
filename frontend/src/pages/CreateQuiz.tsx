import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherAPI } from '../services/api';
import { Question } from '../types';

const CreateQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(30);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await teacherAPI.getQuestions();
      setQuestions(response.data);
    } catch (error) {
      console.error('Failed to load questions', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(qid => qid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !category || selectedIds.length === 0) {
      alert('Please fill all fields and select at least one question');
      return;
    }

    try {
      await teacherAPI.createQuiz({
        title,
        category,
        questionIds: selectedIds,
        timeLimitSeconds: timeLimitMinutes * 60,
        published
      });
      alert('Quiz created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create quiz', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="create-quiz-page">
      <div className="page-header-gradient">
        <h1>➕ Create New Quiz</h1>
        <p>Build engaging quizzes from your question bank</p>
      </div>

      <div className="quiz-creation-layout">
        <div className="quiz-config-panel">
          <h2>🎯 Quiz Configuration</h2>
          <form onSubmit={handleSubmit} className="quiz-form">
        <div className="form-group">
          <label>Quiz Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Time Limit (minutes):</label>
          <input
            type="number"
            value={timeLimitMinutes}
            onChange={(e) => setTimeLimitMinutes(parseInt(e.target.value))}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Publish immediately
          </label>
        </div>

        <div className="questions-selection">
          <h3>Select Questions ({selectedIds.length} selected)</h3>
          {questions.map(question => (
            <div
              key={question._id}
              className={`question-select-item ${selectedIds.includes(question._id) ? 'selected' : ''}`}
              onClick={() => toggleQuestion(question._id)}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(question._id)}
                readOnly
              />
              <div>
                <p className="question-text">{question.questionText}</p>
                <span className="category-badge">{question.category}</span>
              </div>
            </div>
          ))}
        </div>

            <button type="submit" className="submit-btn">
              <span>✨ Create Quiz</span>
            </button>
          </form>
        </div>

        <div className="quiz-preview-panel">
          <h2>📊 Quiz Preview</h2>
          <div className="preview-stats">
            <div className="preview-stat">
              <span className="preview-number">{selectedIds.length}</span>
              <span className="preview-label">Questions Selected</span>
            </div>
            <div className="preview-stat">
              <span className="preview-number">{timeLimitMinutes}</span>
              <span className="preview-label">Minutes</span>
            </div>
            <div className="preview-stat">
              <span className="preview-number">{category || 'Not Set'}</span>
              <span className="preview-label">Category</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
