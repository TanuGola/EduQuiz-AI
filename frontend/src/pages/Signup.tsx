import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

const Signup: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (data: any) => {
    await register(data.name, data.email, data.password, data.role);
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-content">
          <h1 className="auth-hero-title">🎓 EduQuiz-AI</h1>
          <p className="auth-hero-subtitle">Start Your Learning Adventure</p>
          <div className="auth-features">
            <div className="feature-item">📝 Create Custom Quizzes</div>
            <div className="feature-item">🤖 AI Question Generation</div>
            <div className="feature-item">📊 Real-time Analytics</div>
          </div>
        </div>
      </div>
      <div className="auth-container">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join thousands of learners today</p>
        </div>
        <AuthForm mode="signup" onSubmit={handleSignup} />
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
