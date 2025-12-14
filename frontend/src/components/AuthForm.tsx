import React, { useState } from 'react';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (data: any) => Promise<void>;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    if (!formData.role) {
      setError('Please select your role');
      return;
    }

    if (mode === 'signup' && !formData.name) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {mode === 'signup' && (
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      )}
      <input
        type="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <div className="role-selection">
        <label className="role-label">I am a:</label>
        <div className="role-options">
          <div 
            className={`role-option ${formData.role === 'student' ? 'selected' : ''}`}
            onClick={() => setFormData({ ...formData, role: 'student' })}
          >
            <div className="role-icon">🎓</div>
            <div className="role-name">Student</div>
            <div className="role-desc">Take quizzes and track progress</div>
          </div>
          <div 
            className={`role-option ${formData.role === 'teacher' ? 'selected' : ''}`}
            onClick={() => setFormData({ ...formData, role: 'teacher' })}
          >
            <div className="role-icon">🏛️</div>
            <div className="role-name">Teacher</div>
            <div className="role-desc">Create and manage quizzes</div>
          </div>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading || !formData.role}>
        {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Sign Up'}
      </button>
    </form>
  );
};

export default AuthForm;
