import React, { useEffect, useState } from 'react';
import { teacherAPI } from '../services/api';
import { Question } from '../types';

const ManageQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Question>>({});
  const [loading, setLoading] = useState(true);

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

  const handleEdit = (question: Question) => {
    setEditingId(question._id);
    setEditForm(question);
  };

  const handleSave = async () => {
    if (!editingId) return;
    try {
      await teacherAPI.updateQuestion(editingId, editForm);
      setEditingId(null);
      loadQuestions();
    } catch (error) {
      console.error('Failed to update question', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await teacherAPI.deleteQuestion(id);
      loadQuestions();
    } catch (error) {
      console.error('Failed to delete question', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="manage-questions-page">
      <div className="page-header-gradient">
        <h1>📝 Manage Questions</h1>
        <p>Edit, organize, and refine your question bank</p>
      </div>

      <div className="questions-stats">
        <div className="stat-box">
          <span className="stat-number">{questions.length}</span>
          <span className="stat-label">Total Questions</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{[...new Set(questions.map(q => q.category))].length}</span>
          <span className="stat-label">Categories</span>
        </div>
      </div>
      
      {questions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💭</div>
          <p>No questions yet. Upload a document to generate questions!</p>
        </div>
      ) : (
        <div className="questions-list">
        {questions.map(question => (
          <div key={question._id} className="question-item">
            {editingId === question._id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editForm.questionText}
                  onChange={(e) => setEditForm({ ...editForm, questionText: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                />
                {editForm.options?.map((opt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOptions = [...editForm.options!];
                      newOptions[idx] = e.target.value;
                      setEditForm({ ...editForm, options: newOptions });
                    }}
                  />
                ))}
                <select
                  value={editForm.correctIndex}
                  onChange={(e) => setEditForm({ ...editForm, correctIndex: parseInt(e.target.value) })}
                >
                  {[0, 1, 2, 3].map(i => (
                    <option key={i} value={i}>Option {i + 1}</option>
                  ))}
                </select>
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <h3>{question.questionText}</h3>
                <p className="category-badge">{question.category}</p>
                <ul className="options-list">
                  {question.options.map((opt, idx) => (
                    <li key={idx} className={idx === question.correctIndex ? 'correct' : ''}>
                      {opt}
                    </li>
                  ))}
                </ul>
                <div className="actions">
                  <button onClick={() => handleEdit(question)}>Edit</button>
                  <button onClick={() => handleDelete(question._id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default ManageQuestions;
